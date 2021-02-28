import * as theme from './theme';
import 'styled-components';

declare module 'styled-components' {
  type Theme = typeof theme.THEME;
  export interface DefaultTheme extends Theme {}
}
