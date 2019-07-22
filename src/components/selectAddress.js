import React from 'react';

class SelectAddress extends React.Component {
  render() {
    return(
      <div className="addressDetailContainer">
        {this.props.addresses.length === 0 &&
          <p>There are no eligible addresses on this account.  Please ensure your addresses containing OMNI tokens have at least 8000 satoshi in Bitcoin on a single output as well in order to faciliate a transaction.</p>
        }
        {this.props.addresses.map((address, index) => {
          return(
            <article className="addressDetails" data-address={address.address} key={index}>
              <header>
                <h4>{address.address}</h4>
                <button onClick={this.selectAddress} data-address-index={index} className="button">
                  Select Address
                </button>
              </header>

              <table>
                <tbody>
                  {address.omniDetails.balance.map((coin, index) => {
                    return(
                      <tr key={index}>
                        <td className="coin-name">
                          <a target="_blank" rel="noopener noreferrer nofollow" href={coin.propertyinfo.url}>
                            {coin.propertyinfo.name}
                          </a>
                          <small>ID: {coin.propertyinfo.propertyid}</small>
                        </td>
                        <td>{parseInt(coin.value)*0.00000001}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </article>
          );
        })}
      </div>
    )
  }

  selectAddress = (e) => {
    let address = this.props.addresses[parseInt(e.target.getAttribute('data-address-index'))];
    this.props.parentCallback(address);
  }
}

export default SelectAddress;
