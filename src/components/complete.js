import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

class Complete extends React.Component {
  render() {
    return(
      <section className="complete-container">
        <h2>Transaction Complete <FontAwesomeIcon icon={faCheckCircle} /></h2>

        <div class="transaction-hash">
          <p>Transaction Hash</p>
          <address>{this.props.transactionResults.payload.txid}</address>
        </div>

        <div class="view-on-explorers">
          <a href={`https://omniexplorer.info/tx/${this.props.transactionResults.payload.txid}`} target="_blank" rel="noopener noreferrer nofollow" className="button">View on Omni Explorer</a>
          <a href={`https://live.blockcypher.com/btc/tx/${this.props.transactionResults.payload.txid}`} target="_blank" rel="noopener noreferrer nofollow" className="button">View on BlockCypher</a>
          <a href={`https://blockchair.com/bitcoin/transaction/${this.props.transactionResults.payload.txid}`} target="_blank" rel="noopener noreferrer nofollow" className="button">View on Blockchair</a>
        </div>
      </section>
    );
  }
}

export default Complete;
