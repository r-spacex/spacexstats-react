import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Ribbon extends Component {
  render() {
    return (
      <div className="Ribbon">
        <div className="Ribbon__text text-center text-uppercase">
          {this.props.text}
        </div>
      </div>
    );
  }
}

Ribbon.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Ribbon;
