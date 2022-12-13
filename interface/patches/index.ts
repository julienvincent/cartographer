import * as affordable from './affordable';
import * as concrete from './concrete';
import * as full from './full';

export default [
  {
    name: 'Full',
    patch: full.patch
  },
  {
    name: 'Affordable',
    patch: affordable.patch
  },
  {
    name: 'Concrete Powder',
    patch: concrete.patch
  }
];
