import styled from 'styled-components';
import { colorUsages } from '~/stylesheet';
import { OutboundLink } from 'react-ga';

const Link = styled(OutboundLink)`
  &:link,
  &:visited,
  &:hover,
  &:active {
    transition: color ease-in-out 0.3s 0s;
  }

  &:link,
  &:visited {
    color: ${colorUsages.link};
  }

  &:hover,
  &:active {
    color: ${colorUsages.linkHover};
  }
`;

export default Link;
