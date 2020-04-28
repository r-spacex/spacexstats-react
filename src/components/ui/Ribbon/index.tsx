import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { getSpacing, palette } from 'stylesheet';

export const ribbonHeight = '40px';
const ribbonWidth = '250px';
const ribbonLeftCornerSize = '30px';
const ribbonRightCornerSize = '10px';

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: ${getSpacing(8)};
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

  background-color: ${palette.yellow};

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
    border-right: ${ribbonLeftCornerSize} solid ${palette.yellow};
    border-bottom: ${ribbonHeight} solid transparent;
  }

  &:after {
    top: ${ribbonHeight};
    right: 0;
    border-right: ${ribbonRightCornerSize} solid transparent;
    border-top: ${ribbonRightCornerSize} solid ${palette.brown};
  }
`;

interface Props {
  children: ReactNode;
}

const Ribbon: React.FC<Props> = ({ children }) => (
  <Wrapper>
    <Text>{children}</Text>
  </Wrapper>
);

export default Ribbon;
