import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { config, dom } from '@fortawesome/fontawesome-svg-core';
import * as theme from '../theme/theme';
import type * as next from 'next/app';
import font from '@next/font/local';

config.autoAddCss = false;

const pt_mono = font({ src: '../public/PTMono-Regular.ttf' });

const GlobalStyle = createGlobalStyle`
${dom.css()}

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body, input {
    font-family: ${pt_mono.style.fontFamily};
  }

  p {
    margin: 0;
    padding: 0;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

export default function MyApp(props: next.AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme.THEME}>
        <props.Component {...props.pageProps} />
      </ThemeProvider>
    </>
  );
}
