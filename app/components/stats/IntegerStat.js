import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IntegerStat extends Component {
  render() {
    return (
      <div className="IntegerStat text-center">
        <div className="IntegerStat__value">{this.props.data.value.toLocaleString()}</div>
        <div className="IntegerStat__subtitle text-uppercase">{this.props.data.subtitle}</div>
      </div>
    );
  }
}

IntegerStat.propTypes = {
  data: PropTypes.object.isRequired,
};

export default IntegerStat;
