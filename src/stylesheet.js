import { css } from 'styled-components';

const palette = {
  transparentWhite: 'rgba(250, 250, 250, 0.75)',
  lightGrey: '#fafafa',
  grey: '#bbbbbb',
  darkGrey: '#21272B',
  black: '#000000',

  lightblue: '#9ad0f3',
  blue: '#0072b2',
  green: '#009E73',
  lightYellow: '#f0e442',
  yellow: '#ccac55',
  brown: '#69551f',
  orange: '#e79f00',
  red: '#d55e00',
  pink: '#CC79A7'
};

// Colourblind friendly palette
export const chartColors = {
  white: palette.lightGrey,
  grey: palette.grey,
  yellow: palette.lightYellow,
  orange: palette.orange,
  brown: palette.brown,
  red: palette.red,
  lightblue: palette.lightblue,
  blue: palette.blue,
  green: palette.green,
  pink: palette.pink,
  black: palette.black
};

export const colorUsages = {
  text: palette.lightGrey,
  link: palette.blue,
  linkHover: palette.yellow,

  contentBackground: 'rgba(24, 28, 31, 0.8)',
  contentShadow: 'rgba(24, 28, 31, 0.2)',
  footer: palette.darkGrey,
  footerBackground: palette.transparentWhite,

  progressBar: palette.yellow,
  navbarActiveTab: palette.yellow,
  ribbonBackground: palette.yellow,
  ribbonBorder: palette.brown,
  tableBorder: palette.lightGrey
};

export const thresholds = {
  sm: '768px',
  md: '992px',
  lg: '1200px'
};

export const fonts = {
  main: css`
    font-family: 'Noto Sans', sans-serif;
  `,
  special: css`
    font-family: 'BrandonThin', sans-serif;
    font-weight: 100;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.5);
  `
};

export const fontSizes = {
  base: '14px'
};
