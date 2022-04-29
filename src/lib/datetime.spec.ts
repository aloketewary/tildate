import test from 'ava';

import { DateTime } from './datetime';

test('DateTime() is same as js Date()', async (t) => {
  t.is(new DateTime().toDateString(), new Date().toDateString());
});

test('DateTime() convert from JS Date()', async (t) => {
  const jsDate = new Date(2022, 0o3, 10);
  const dateTime = DateTime.convert(jsDate);
  t.is(dateTime.toDateString(), jsDate.toDateString());
});

test('DateTime() clone() is same', async (t) => {
  const dateTime = new DateTime();
  t.is(dateTime.clone.toDateString(), dateTime.toDateString());
});
