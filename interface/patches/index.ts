import * as concrete from './concrete';
import * as primary from './primary';

export default [
  {
    name: 'Primary',
    patch: primary.patch
  },
  {
    name: 'Concrete Powder',
    patch: concrete.patch
  }
];
