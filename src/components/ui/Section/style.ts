import styled, { css } from 'styled-components';
import BackgroundImage from 'components/ui/BackgroundImage';

import { getSpacing, palette, fonts, thresholds } from 'stylesheet';

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

  height: 60px;
  @media (min-width: ${thresholds.sm}) {
    font-size: 3rem;
    height: 120px;
  }
`;

const SHADOW_SIZE = '3px';
export const Content = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;

  min-height: 450px;
  margin-bottom: ${getSpacing(8)};
  background-color: ${palette.transparentDark};
  z-index: 0;

  /* Custom "shadow" border */
  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    top: -${SHADOW_SIZE};
    left: -${SHADOW_SIZE};
    right: -${SHADOW_SIZE};
    bottom: -${SHADOW_SIZE};
    border: ${SHADOW_SIZE} solid ${palette.shadowDark};
  }
`;

export const SectionContent = styled.div`
  position: relative;
  padding: ${getSpacing(2)};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SectionDescription = styled.div`
  min-height: 120px; /* It can host 3 lines on normal conditions */
  padding: ${getSpacing(4)} ${getSpacing(2)};
`;

const chevronThickness = '0.25rem';
const chevronWidth = '1rem';

interface ButtonProps {
  up?: boolean;
  down?: boolean;
}

export const Control = styled.button<ButtonProps>`
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
    border-color: ${palette.lightGrey};

    position: relative;
    left: 0.15em;

    top: ${({ up }) => (up ? `0` : `0.15rem`)};
    transform: rotate(${({ up }) => (up ? `-45deg` : `135deg`)});
  }

  ${({ up }) =>
    up &&
    css`
      top: -2rem;
    `}
  ${({ down }) =>
    down &&
    css`
      bottom: -2rem;
    `}
`;
