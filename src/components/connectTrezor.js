import React from 'react';
import TrezorConnect from 'trezor-connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

class ConnectTrezor extends React.Component {
  render() {
    return(
      <article className="connect-trezor">
        <h3><FontAwesomeIcon icon={faExclamationTriangle} className="is-hidden"/> Please Read Before Continuing <FontAwesomeIcon icon={faExclamationTriangle} className="is-hidden"/></h3>

        <div className="preflight-checklist-container">
          <div className="checklist">
            <p>Have you...</p>
            <ul>
              <li>Checked that the URL bar says https://trezor.github.io/omni-trezor ?</li>
              <li>Verified your recipient address?</li>
              <li>Confirmed you have at least one output in your sending address greater than or equal to 0.00008 BTC?</li>
              <li>Audited this tool's <a href="https://github.com/trezor/omni-trezor" target="_blank" rel="noopener noreferrer">source code on GitHub?</a></li>
              <li>Read the <a href="https://github.com/trezor/omni-trezor/blob/master/TERMS.md" target="_blank" rel="noopener noreferrer">Terms of Use?</a></li>
            </ul>
          </div>
        </div>

        <p>If so, this tool allows you to send OMNI transactions using your Trezor's Bitcoin addresses.  Click the button below to continue.</p>

        <button id="discoverAccounts" onClick={this.discoverAccounts} className="button">Connect to Trezor</button>
        <small>By continuing you agree to the <a href="https://github.com/trezor/omni-trezor/blob/master/TERMS.md" target="_blank" rel="noopener noreferrer">Terms of Use.</a></small>
      </article>
    )
  }

  discoverAccounts = async () => {
    this.props.setLoading(true);
    let accountResults = await TrezorConnect.getAccountInfo({
      coin: 'btc',
      details: 'tokens'
    });
    this.props.setLoading(false);
    this.props.parentCallback(accountResults);
  }
}

export default ConnectTrezor;
