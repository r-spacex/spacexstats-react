import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colorUsages } from '~/stylesheet';

const ribbonHeight = '40px';
const ribbonWidth = '250px';
const ribbonLeftCornerSize = '30px';
const ribbonRightCornerSize = '10px';

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 4rem;
  width: ${ribbonWidth};
`;

const Text = styled.div`
  position: relative;
  z-index: 1;
  display: inline-block;

  width: calc(100% + ${ribbonRightCornerSize});
  height: ${ribbonHeight};
  line-height: ${ribbonHeight};
  text-align: center;
  text-transform: uppercase;

  background-color: ${colorUsages.ribbonBackground};

  &:before,
  &:after {
    position: absolute;
    content: '';
    display: block;
    width: 0;
    height: 0;
  }

  &:before {
    top: 0;
    left: -${ribbonLeftCornerSize};
    border-right: ${ribbonLeftCornerSize} solid ${colorUsages.ribbonBackground};
    border-bottom: ${ribbonHeight} solid transparent;
  }

  &:after {
    top: ${ribbonHeight};
    right: 0;
    border-right: ${ribbonRightCornerSize} solid transparent;
    border-top: ${ribbonRightCornerSize} solid ${colorUsages.ribbonBorder};
  }
`;

const Ribbon = ({ text }) => (
  <Wrapper>
    <Text>{text}</Text>
  </Wrapper>
);

Ribbon.propTypes = {
  text: PropTypes.string.isRequired
};

export default Ribbon;
