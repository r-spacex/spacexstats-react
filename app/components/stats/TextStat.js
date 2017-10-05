import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextStat extends Component {
  render() {
    return (
      <div className="TextStat text-center text-uppercase">{this.props.data}</div>
    );
  }
}

TextStat.propTypes = {
  data: PropTypes.string.isRequired,
};

export default TextStat;
