import React from 'react';

class SpecifyDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assetIndex: 0,
      amount: '',
      recipient: ''
    }
  }

  render() {
    return(
      <section className="transaction-details-form-container">
        <header>
          <h2>Specify Transaction Details</h2>
        </header>

        <form>
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="select is-fullwidth">
              <select value="simplesend" readOnly={true}>
                <option value="simplesend">Simple Send</option>
              </select>
            </div>
          </div>

          <div className="txAssetAmountContaier">

            <div className="form-group">
              <label>Asset</label>
              <div className="select">
                <select value={this.state.assetIndex} onChange={this.handleChange} name='asset'>
                  {this.props.address.omniDetails.balance.filter(c => c.id !== '0').map((c, index) => {
                    return(
                      <option value={index} key={c.id}>{c.propertyinfo.name} (ID: {c.id})</option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" value={this.state.amount} onChange={this.handleChange} name='amount' className="input"/>
            </div>
          </div>

          <div className="form-group">
            <label>Receiving Address</label>
            <input type="text" value={this.state.recipient} onChange={this.handleChange} name='recipient' className="input" />
          </div>

          <div className="form-group">
            <button className="button is-fullwidth" onClick={this.handleSubmit}>Submit</button>
          </div>
        </form>
      </section>
    );
  }

  handleChange = (e) => {
    switch (e.target.getAttribute('name')) {
      case 'asset':
        this.setState({assetIndex: e.target.value});
        break;
      case 'amount':
        this.setState({amount: e.target.value});
        break;
      case 'recipient':
        this.setState({recipient: e.target.value});
        break;
      default:
        break;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.parentCallback(this.state)
  }
}

export default SpecifyDetails;
