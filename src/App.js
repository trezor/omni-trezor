import React from 'react';
import TrezorConnect from 'trezor-connect';
import ReactGA from 'react-ga';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import './App.scss';
import BreadcrumbNav from './components/breadcrumbNav';
import ConnectTrezor from './components/connectTrezor';
import SelectAddress from './components/selectAddress';
import SpecifyDetails from './components/specifyDetails';
import ConfirmTransaction from './components/confirmTransaction';
import Complete from './components/complete';

class App extends React.Component {
  constructor(props) {
    super(props);

    // this.handleDiscoverAccounts = this.handleDiscoverAccounts.bind(this);
    // this.setLoading = this.setLoading.bind(this);

    this.state = {
      loading: true,
      loadingAlt: false,
      currentStep: 0,
      accountInfo: {},
      accountAddresses: [],
      sendAddress: {},
      transactionElements: {},
      transactionIO: {},
      transactionResults: {}
    };
  }

  componentWillMount() {
    this.transactionSteps = {
      0: 'connectTrezor',
      1: 'selectAddress',
      2: 'specifyDetails',
      3: 'confirmTransaction',
      4: 'complete'
    };

    ReactGA.initialize('UA-144274728-1');
    ReactGA.pageview(window.location.pathname + this.transactionSteps[this.state.currentStep]);
  }

  componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    TrezorConnect.manifest({
        email: 'admin@tektitesoftware.com',
        appUrl: 'https://omnitrezor.com'
    });

    return (
      <main className="app">
        <header className="app-header">
          <h1 className="title">OMNI Wallet for Trezor</h1>
          <p className="subtitle">by <a href="https://tektitesoftware.com" target="_blank" rel="noopener noreferrer">Tektite Software</a></p>
        </header>

        <article className="app-body">
          <BreadcrumbNav
            setStep={this.setStep}
            transactionSteps={this.transactionSteps}
            currentStep={this.state.currentStep}
          />

          <section className="transaction-container">
            {
              this.state.loading ? (
                <FontAwesomeIcon icon={faCog} spin className="loading-spinner"/>
              ) : (
                {
                  connectTrezor: <ConnectTrezor
                    parentCallback={this.handleDiscoverAccounts} setLoading={this.setLoading}
                  />,
                  selectAddress: <SelectAddress
                    parentCallback={this.handleSelectAddress}
                    addresses={this.state.accountAddresses}
                  />,
                  specifyDetails: <SpecifyDetails
                    parentCallback={this.handleSpecifyDetails}
                    address={this.state.sendAddress}
                  />,
                  confirmTransaction: <ConfirmTransaction
                    parentCallback={this.handleConfirmTransaction}
                    transactionElements={this.state.transactionElements}
                    transactionIO={this.state.transactionIO}
                    sendAddress={this.state.sendAddress}
                    loadingAlt={this.state.loadingAlt}
                    setLoadingAlt={this.setLoadingAlt}
                  />,
                  complete: <Complete
                    transactionResults={this.state.transactionResults}
                  />
                }[this.transactionSteps[this.state.currentStep]]
              )
            }

          </section>
        </article>

        <footer className="app-footer">
          <small>&copy; {(new Date(Date.now())).getFullYear()} Tektite Software LLC.  This tool is Open Source and <a href="https://github.com/tektite-software/omni-trezor" target="_blank" rel="noopener noreferrer">available on GitHub.</a></small>
        </footer>
      </main>
    );
  }

  setLoading = (loadingStatus) => {
    this.setState({loadingAlt: false});
    this.setState({loading: loadingStatus});
  }

  // This is used by some components for specific functionality, whereas
  // setLoading() has a global effect.
  setLoadingAlt = (loadingStatus) => {
    this.setState({loadingAlt: loadingStatus});
  }

  setStep = (step) => {
    ReactGA.pageview(window.location.pathname + this.transactionSteps[step]);
    this.setState({currentStep: step});
  }

  handleDiscoverAccounts = async (accountResults) => {
    console.log('Exported account details:\n', accountResults);
    if (accountResults.success === true) {
      this.setLoading(true);
      this.setState({accountInfo: accountResults.payload});
      let transactions = accountResults.payload.utxo;
      let eligibleTxs = transactions.filter(tx => tx.value >= 8000);
      let sortedTxs = eligibleTxs.sort(tx => tx.value);
      let addressPaths = eligibleTxs.map(tx => tx.addressPath).filter((v, i, a) => a.indexOf(v) === i);
      let eligibleAddrs = addressPaths.map(a => {
        let tx = sortedTxs.find(tx => tx.addressPath === a);
        return({
          addressPath: a,
          outTxHash: tx.transactionHash,
          outTxIndex: tx.index,
          outTxValue: tx.value
        });
      });
      let transactionApiResults = {};
      for (const a of eligibleAddrs) {
        let txResultRaw = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${a.outTxHash}`);
        let txResultJson = await txResultRaw.json();
        transactionApiResults[a.outTxHash] = txResultJson;
      }
      eligibleAddrs = eligibleAddrs.map((a) => {
        a.address = transactionApiResults[a.outTxHash].outputs[a.outTxIndex].addresses[0];
        return a;
      });
      console.log('Detected eligible addresses:\n', eligibleAddrs);

      let omniDetailsRaw = await fetch('https://api.omniwallet.org/v2/address/addr/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: eligibleAddrs.map(a => `addr=${a.address}`).join('&')
      });
      let omniDetails = await omniDetailsRaw.json();
      console.log('Eligible address OMNI details:\n', omniDetails);

      let addressDetails = eligibleAddrs.map(a => {
        a.omniDetails = omniDetails[a.address];
        return a;
      });
      addressDetails = addressDetails.filter(a => a.omniDetails.balance.length > 1);
      this.setState({accountAddresses: addressDetails});
      console.log('Final parsed address details:\n', addressDetails);

      this.setStep(1);
      this.setLoading(false);
    } else {
      this.setLoading(false);
    }
  }

  handleSelectAddress = async (address) => {
    this.setLoading(true);

    this.setState({sendAddress: address});

    this.setStep(2);
    this.setLoading(false);
  }

  handleSpecifyDetails = async (data) => {
    this.setLoading(true);

    let formData = {
      asset: this.state.sendAddress.omniDetails.balance[data.assetIndex],
      amount: data.amount,
      recipient: data.recipient,
    }
    console.log('Received the following transaction details from form:\n', formData);

    this.setState({
      transactionElements: {
        asset: formData.asset,
        amount: formData.amount,
        recipient: formData.recipient,
      }
    }, async () => {
      let transactionIO = await this._generateTransaction();
      this.setState({transactionIO: transactionIO});

      this.setStep(3);
      this.setLoading(false);
    });
  }

  handleConfirmTransaction = async () => {
    this.setLoadingAlt(true);

    let transactionResults = await this._signSendTransaction();
    this.setState({transactionResults: transactionResults}, () => {
      console.log('Transaction results:\n', transactionResults);
      this.setLoadingAlt(false);

      if (transactionResults.success === true) {
        this.setStep(4);
        ReactGA.event({
          category: 'Transaction',
          action: 'Success'
        })
      } else {
        alert("There was an issue completing the transaction.\nSee the console for details.");
      }

      this.setLoading(false);
    });
  }

  _generateTransaction = async () => {
    let omniPrefix = '6f6d6e69';
    let omniVersion = '0000';
    let omniAssetId = parseInt(this.state.transactionElements.asset.id).toString(16).padStart(12, 0);
    let omniAmount = this.state.transactionElements.amount;
    if (this.state.transactionElements.asset.divisible === true) {
      omniAmount = (omniAmount * 100000000);
    }
    omniAmount = omniAmount.toString(16).padStart(16, 0);
    let omniSegments = [
      omniPrefix, // OMNI
      omniVersion,     // Version
      omniAssetId,
      omniAmount
    ]
    let omniSimpleSendData = omniSegments.join('')

    let fullAddressPath = this.state.accountInfo.path.concat(this.state.sendAddress.addressPath);

    var calculatedFee;
    var changeAmount;
    // If you have 12600 satoshi or more in the output, you get change.
    // The minimum change amount is 600 satoshi.
    let gettingChange = (this.state.sendAddress.outTxValue >= 12600);
    if (gettingChange) {
      changeAmount = (this.state.sendAddress.outTxValue - 12000);
      calculatedFee = 11400;
    } else {
      calculatedFee = (this.state.sendAddress.outTxValue - 600);
    }

    let inputs = [{
      address_n: fullAddressPath,
      prev_index: this.state.sendAddress.outTxIndex,
      prev_hash: this.state.sendAddress.outTxHash,
      amount: this.state.sendAddress.outTxValue.toString(),
      script_type: 'SPENDP2SHWITNESS'
    }];

    let outputs = [
      {
        op_return_data: omniSimpleSendData,
        amount: '0',
        script_type: 'PAYTOOPRETURN'
      },
      {
        address: this.state.transactionElements.recipient,
        amount: '600',
        script_type: 'PAYTOADDRESS'
      }
    ];

    if (gettingChange) {
      outputs.push({
        address_n: fullAddressPath,
        amount: changeAmount.toString(),
        script_type: 'PAYTOP2SHWITNESS'
      });

      // inputs[0].script_type = 'SPENDP2SHWITNESS';
      // inputs[0].amount = this.state.sendAddress.outTxValue.toString();
    }

    return({
      inputs: inputs,
      outputs: outputs,
      opreturnData: omniSimpleSendData,
      opreturnDataSegments: omniSegments,
      estimatedFee: calculatedFee
    });
  }

  _signSendTransaction = async() => {
    let transactionResults = await TrezorConnect.signTransaction({
      inputs: this.state.transactionIO.inputs,
      outputs: this.state.transactionIO.outputs,
      coin: 'btc',
      push: true
    });
    return(transactionResults);
  }
}

export default App;
