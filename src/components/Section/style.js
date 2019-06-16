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

export const Stat = styled.div`
  position: relative;
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Text = styled.div`
  min-height: 8rem; /* It can host 3 lines on normal conditions */
  padding: 2rem 1rem;
`;

export const Control = styled.button`
  position: absolute;
  cursor: pointer;
  font-size: 3rem;
  right: 1rem;

  ${({ up }) => up && `top: -3rem`}
  ${({ down }) => down && `bottom: -3rem`}
`;
