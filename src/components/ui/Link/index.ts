import styled from 'styled-components';
import { OutboundLink } from 'react-ga';
import { palette } from 'stylesheet';

const Link = styled(OutboundLink)`
  &:link,
  &:visited,
  &:hover,
  &:active {
    transition: color ease-in-out 0.3s 0s;
  }

  &:link,
  &:visited {
    color: ${palette.blue};
  }

  &:hover,
  &:active {
    color: ${palette.yellow};
  }
`;

export default Link;
