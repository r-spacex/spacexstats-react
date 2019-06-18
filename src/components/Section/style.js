import styled from 'styled-components';
import BackgroundImage from 'components/BackgroundImage';

import { colorUsages, fonts, thresholds } from 'stylesheet';

export const Background = styled(BackgroundImage)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  background-size: cover;
  background-position: center center;
  transition: background-image 0.3s ease-in-out;
`;

export const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 95%;

  @media only screen and (min-width: ${thresholds.sm}) {
    width: ${thresholds.sm};
  }
  @media only screen and (min-width: ${thresholds.md}) {
    width: ${thresholds.md};
  }
  @media only screen and (min-width: ${thresholds.lg}) {
    width: ${thresholds.lg};
  }
`;

export const Title = styled.h2`
  ${fonts.special}
  display: flex;
  align-items: center;
  padding: 0.5rem;

  height: 5rem;
  @media (min-width: ${thresholds.sm}) {
    font-size: 3rem;
    height: 10rem;
  }
`;

export const Content = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;

  min-height: 20rem;
  margin-bottom: 5rem;
  background-color: ${colorUsages.contentBackground};
  z-index: 0;

  /* Custom "shadow" border */
  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 3px solid ${colorUsages.contentShadow};
  }
`;

export const SectionContent = styled.div`
  position: relative;
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SectionDescription = styled.div`
  min-height: 8rem; /* It can host 3 lines on normal conditions */
  padding: 2rem 1rem;
`;

const chevronThickness = '0.25rem';
const chevronWidth = '1rem';

export const Control = styled.button`
  position: absolute;
  cursor: pointer;
  right: 1rem;

  &:before {
    content: '';
    display: inline-block;
    height: ${chevronWidth};
    width: ${chevronWidth};
    vertical-align: top;
    border-style: solid;
    border-width: ${chevronThickness} ${chevronThickness} 0 0;
    border-color: ${colorUsages.text};

    position: relative;
    left: 0.15em;

    top: ${({ up }) => (up ? `0` : `0.15rem`)};
    transform: rotate(${({ up }) => (up ? `-45deg` : `135deg`)});
  }

  ${({ up }) => up && `top: -2rem`}
  ${({ down }) => down && `bottom: -2rem`}
`;
