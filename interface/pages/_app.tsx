import { createGlobalStyle, ThemeProvider } from 'styled-components';
import * as theme from '../theme/theme';
import type * as next from 'next/app';

import { config, dom } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

const GlobalStyle = createGlobalStyle`
${dom.css()}

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
