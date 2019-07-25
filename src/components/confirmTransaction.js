import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

class ConfirmTransaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opreturnVisible: false
    }
  }

  render() {
    return(
      <article className="confirm-transaction-container">
        <header>
          <h2>Confirm Transaction</h2>
        </header>

        <section className="sending-from">
          <p><b>Simple Send</b> Operation of <b>{this.props.transactionElements.amount} {this.props.transactionElements.asset.propertyinfo.name}</b> From</p>
          <address>{this.props.sendAddress.address}</address>
        </section>

        <p className="opreturn-details-toggle" onClick={this.toggleOpreturnDetails}>
          {this.state.opreturnVisible ?
            <FontAwesomeIcon icon={faChevronUp} />
          :
            <FontAwesomeIcon icon={faChevronDown} />
          }
          {this.state.opreturnVisible ?
            " Hide OP_RETURN Details"
          :
            " Show OP_RETURN Details"
          }
        </p>
        <section className={`opreturn-details ${this.state.opreturnVisible ? "" : "is-hidden"}`}>
          <small>OP_RETURN data for the OMNI transaction.  This may be shown on your Trezor depending on firmware version.</small>
          <table>
            <tbody>
              <tr>
                <td className="omni-prefix omni-segment">{this.props.transactionIO.opreturnDataSegments[0]}</td>
                <td className="omni-version omni-segment">{this.props.transactionIO.opreturnDataSegments[1]}</td>
                <td className="omni-asset-id omni-segment">{this.props.transactionIO.opreturnDataSegments[2]}</td>
                <td className="omni-amount omni-segment">{this.props.transactionIO.opreturnDataSegments[3]}</td>
              </tr>
              <tr>
                <td><small>Prefix</small></td>
                <td><small>Version</small></td>
                <td><small>Asset ID</small></td>
                <td><small>Amount</small></td>
              </tr>
              <tr>
                <td><code>{this._hexToString(this.props.transactionIO.opreturnDataSegments[0])}</code></td>
                <td><code>{parseInt(this.props.transactionIO.opreturnDataSegments[1], 16)}</code></td>
                <td><code>{parseInt(this.props.transactionIO.opreturnDataSegments[2], 16)}</code></td>
                <td>
                  <code>{this.props.transactionElements.asset.divisible ? parseInt(this.props.transactionIO.opreturnDataSegments[3], 16) * 0.00000001 : parseInt(this.props.transactionIO.opreturnDataSegments[3], 16)}</code>
                  {this.props.transactionElements.asset.divisible ?
                    <small>(Divisible)</small>
                  :
                    <small>(Not Divisible)</small>
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="recipient">
          <small>Recipient Address</small>
          <address>{this.props.transactionElements.recipient}</address>
        </section>

        <section className="estimated-fee">
          <small>Estimated Fee: {this.props.transactionIO.estimatedFee * 0.00000001} BTC</small>
          <small>Note: Also sending 0.000006 BTC to recipient to faciliate OMNI transaction.</small>
        </section>

        <button className={`button is-fullwidth ${this.props.loadingAlt ? 'disabled' : ''}`} onClick={this.signSend} disabled={this.props.loadingAlt}>
          {this.props.loadingAlt ?
            <FontAwesomeIcon icon={faCog} spin/>
          :
            "Sign & Send"
          }
        </button>
      </article>
    );
  }

  toggleOpreturnDetails = () => {
    this.setState((state, props) => {
      return {
        opreturnVisible: !state.opreturnVisible
      }
    });
  }

  signSend = () => {
    this.props.setLoadingAlt(true);
    this.props.parentCallback();
  }

  _hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }
}

export default ConfirmTransaction;
