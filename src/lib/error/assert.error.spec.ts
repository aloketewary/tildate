import test from 'ava';
import { assert } from './assert.error';

test('Assertion assert false', async (t) => {
    t.notThrows(() => assert('' === '', 'Success'));
});

test('Assertion assert true', async (t) => {
  const error = t.throws(() => {
		assert('' !== '');
	}, {instanceOf: Error});

	t.is(error.message, 'Assertion failed');
});