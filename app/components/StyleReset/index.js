import { createGlobalStyle } from 'styled-components';
import { colorUsages, fonts, fontSizes } from '~/stylesheet';

const StyleReset = createGlobalStyle`
  html {
    height: 100%;
    ${fonts.main}
    font-size: ${fontSizes.base};
    color: ${colorUsages.text};
  }

  body {
    min-height: 100%;
  }

  button {
    border: 0;
    background-color: transparent;
    color: inherit;
    outline: 0;
    font: inherit;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

export default StyleReset;
