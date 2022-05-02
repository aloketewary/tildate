import { DateTimeFormat } from './datetime.format';

import test from 'ava';

test('DateTimeFormat pattern test', async (t) => {
  const dateTimeFormat = new DateTimeFormat().of('yyyy');
	t.is(dateTimeFormat.pattern, 'yyyy');
});
