import { css } from 'styled-components';

const palette = {
  darkGrey: '#21272B',
  lightGrey: '#FAFAFA',
  yellow: '#ccac55',
  blue: 'steelblue',
  green: 'mediumseagreen',
  red: 'crimson',
  brown: '#69551f'
};

export const colorUsages = {
  navbarActiveTab: palette.yellow,
  ribbonBackground: palette.yellow,
  ribbonBorder: palette.brown,
  text: palette.lightGrey,
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

/*
Palette of colors - do not use directly. Create intermdiary variables instead
$link-color = $blue
$link-color-hover = $yellow
$footer-color = $dark-grey

$table-border-color = $light-grey
*/
