import { DateTimeFormatError } from './date-format.error';
import test from 'ava';

test('DateTimeFormatError throwing error test', async (t) => {
  const error = t.throws(() => {
		throw new DateTimeFormatError('Error')
	}, {instanceOf: DateTimeFormatError});

	t.is(error.message, 'Error Stack ');
});

test('DateTimeFormatError throwing error test with stack', async (t) => {
  const error = t.throws(() => {
		throw new DateTimeFormatError('Error', Error('Test'))
	}, {instanceOf: DateTimeFormatError});

	t.is(error.name, 'DateTimeFormatError');
});