import type * as next from 'next/app';
import { createGlobalStyle, ThemeProvider, DefaultTheme } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #282828;
    color: #ebdbb2;
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

const theme: DefaultTheme = {
  blue: '#458588',
  light_blue: '#83a598',

  background: '#282828',
  foreground: '#ebdbb2'
};

export default function MyApp(props: next.AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <props.Component {...props.pageProps} />
      </ThemeProvider>
    </>
  );
}
