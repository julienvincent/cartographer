import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { config, dom } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from '@vercel/analytics/react';
import * as theme from '../theme/theme';
import type * as next from 'next/app';
import font from '@next/font/local';
import dynamic from 'next/dynamic';

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

export function App(props: next.AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme.THEME}>
        <props.Component {...props.pageProps} />
        <Analytics />
      </ThemeProvider>
    </>
  );
}

export default dynamic(async () => App, {
  ssr: false
});
