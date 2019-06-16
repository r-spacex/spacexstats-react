import { createGlobalStyle } from 'styled-components';
import { colorUsages, fonts, fontSizes } from 'stylesheet';

const StyleReset = createGlobalStyle`
  @font-face {
    font-family: 'Brandon';
    src: url('fonts/brandon-reg-webfont.ttf'), url('fonts/brandon-reg-webfont.eot');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'BrandonThin';
    src: url('fonts/brandon-thin-webfont.ttf'), url('fonts/brandon-thin-webfont.eot');
    font-weight: normal;
    font-style: normal;
  }


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
    line-height: 1;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

export default StyleReset;
