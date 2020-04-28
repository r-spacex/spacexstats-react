import { createGlobalStyle } from 'styled-components';
import { fonts, palette } from 'stylesheet';

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
    color: ${palette.lightGrey};
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

  /* Top progress bar */
  #nprogress {
    .bar {
      background: ${palette.yellow};
    }
    .peg {
      box-shadow: 0 0 10px ${palette.yellow}, 0 0 5px ${palette.yellow};
    }
  }
`;

export default StyleReset;
