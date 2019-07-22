import React from 'react';

class BreadcrumbNav extends React.Component {
  render() {
    return(
      <nav className="transaction-breadcrumbs" aria-label="breadcrumbs">
        <ul>
          <li data-step={0} className={`${this.props.currentStep >= 0 ? 'active' : ''} ${this.props.currentStep === 0 ? 'current' : ''}`} onClick={this.handleNavClick}>Connect Trezor</li>
          <span className={`${this.props.currentStep >= 1 ? 'active' : ''}`}>→</span>
          <li data-step={1} className={`${this.props.currentStep >= 1 ? 'active' : ''} ${this.props.currentStep === 1 ? 'current' : ''}`} onClick={this.handleNavClick}>Select Address</li>
          <span className={`${this.props.currentStep >= 2 ? 'active' : ''}`}>→</span>
          <li data-step={2} className={`${this.props.currentStep >= 2 ? 'active' : ''} ${this.props.currentStep === 2 ? 'current' : ''}`} onClick={this.handleNavClick}>Specify Details</li>
          <span className={`${this.props.currentStep >= 3 ? 'active' : ''}`}>→</span>
          <li data-step={3} className={`${this.props.currentStep >= 3 ? 'active' : ''} ${this.props.currentStep === 3 ? 'current' : ''}`} onClick={this.handleNavClick}>Sign & Send</li>
          <span className={`${this.props.currentStep >= 4 ? 'active' : ''}`}>→</span>
          <li data-step={4} className={`${this.props.currentStep >= 4 ? 'active' : ''} ${this.props.currentStep === 4 ? 'current' : ''}`} onClick={this.handleNavClick}>Complete</li>
        </ul>
      </nav>
    );
  }

  handleNavClick = (e) => {
    if (e.target.classList.contains('active') && !e.target.classList.contains('current')) {
      this.props.setStep(e.target.getAttribute('data-step'));
    }
  }
}

export default BreadcrumbNav
