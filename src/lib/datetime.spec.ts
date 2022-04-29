import test from 'ava';

import { DateTime } from './datetime';

test('DateTime() is same as js Date()', async (t) => {
  t.is(new DateTime().toDateString(), new Date().toDateString());
});
