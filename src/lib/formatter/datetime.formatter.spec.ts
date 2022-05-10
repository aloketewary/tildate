
import test from 'ava';
import { DateTime } from '../datetime';
import { DateTimeFormat } from './datetime.format';
import { DateTimeFormatter } from './datetime.formatter';

test('DateTimeFormatter format test yyyy', async (t) => {
  const dateTime = new DateTime(2022, 0o3);
  const dateTimeFormat = DateTimeFormatter.init.ofPattern('yyyy').format(dateTime);
	t.is(dateTimeFormat, '2022');
});

test('DateTimeFormatter format test yyyy-MM-dd hh:mm:ss.SSS', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 23, 45, 6);
  const format = new DateTimeFormat().of('yyyy-MM-dd hh:mm:ss.SSS');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '2022-04-10 11:45:06.000');
});

test('DateTimeFormatter format test G uuuu-MM-dd\'T\'HH:mm:ss.SSSZ', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 23, 45, 6);
  const format = new DateTimeFormat().of('G uuuu-MM-dd\'T\'HH:mm:ss.SSSZ');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, 'AD 2022-04-10T23:45:06.000+0530');
});

test('DateTimeFormatter format test d y yyy uu yy L M', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 23, 45, 6);
  const format = new DateTimeFormat().of('d y yyy uu yy L M');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '10 2022 2022 22 22 5 5');
});

test('DateTimeFormatter format test LL LLL LLLL LLLLL', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 23, 45, 6);
  const format = new DateTimeFormat().of('LL LLL LLLL LLLLL');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '05 May May M');
  const dateTime2 = new DateTime(2022, 0, 10, 23, 45, 6);
  const dateTimeFormat2 = DateTimeFormatter.init.ofPattern(format).format(dateTime2);
	t.is(dateTimeFormat2, '01 Jan January J');
  const dateTime3 = new DateTime(2022, 1, 10, 23, 45, 6);
  const dateTimeFormat3 = DateTimeFormatter.init.ofPattern(format).format(dateTime3);
	t.is(dateTimeFormat3, '02 Feb February F');
  const dateTime4 = new DateTime(2022, 2, 10, 23, 45, 6);
  const dateTimeFormat4 = DateTimeFormatter.init.ofPattern(format).format(dateTime4);
	t.is(dateTimeFormat4, '03 Mar March M');
  const dateTime55 = new DateTime(2022, 3, 10, 23, 45, 6);
  const dateTimeFormat55 = DateTimeFormatter.init.ofPattern(format).format(dateTime55);
	t.is(dateTimeFormat55, '04 Apr April A');
  const dateTime5 = new DateTime(2022, 4, 10, 23, 45, 6);
  const dateTimeFormat5 = DateTimeFormatter.init.ofPattern(format).format(dateTime5);
	t.is(dateTimeFormat5, '05 May May M');
  const dateTime6 = new DateTime(2022, 5, 10, 23, 45, 6);
  const dateTimeFormat6 = DateTimeFormatter.init.ofPattern(format).format(dateTime6);
	t.is(dateTimeFormat6, '06 Jun June J');
  const dateTime7 = new DateTime(2022, 6, 10, 23, 45, 6);
  const dateTimeFormat7 = DateTimeFormatter.init.ofPattern(format).format(dateTime7);
	t.is(dateTimeFormat7, '07 Jul July J');
  const dateTime8 = new DateTime(2022, 7, 10, 23, 45, 6);
  const dateTimeFormat8 = DateTimeFormatter.init.ofPattern(format).format(dateTime8);
	t.is(dateTimeFormat8, '08 Aug August A');
  const dateTime9 = new DateTime(2022, 8, 10, 23, 45, 6);
  const dateTimeFormat9 = DateTimeFormatter.init.ofPattern(format).format(dateTime9);
	t.is(dateTimeFormat9, '09 Sep September S');
  const dateTime10 = new DateTime(2022, 9, 10, 23, 45, 6);
  const dateTimeFormat10 = DateTimeFormatter.init.ofPattern(format).format(dateTime10);
	t.is(dateTimeFormat10, '10 Oct October O');
  const dateTime11 = new DateTime(2022, 10, 10, 23, 45, 6);
  const dateTimeFormat11 = DateTimeFormatter.init.ofPattern(format).format(dateTime11);
	t.is(dateTimeFormat11, '11 Nov November N');
  const dateTime12 = new DateTime(2022, 11, 11, 23, 45, 6);
  const dateTimeFormat12 = DateTimeFormatter.init.ofPattern(format).format(dateTime12);
	t.is(dateTimeFormat12, '12 Dec December D');
});

test('DateTimeFormatter format test KK k K kk a', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 11, 45, 6);
  const format = new DateTimeFormat().of('KK k K kk a');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '11 11 11 11 AM');
});

test('DateTimeFormatter format test m s S SS SSSS SSSSS SSSSSS SSSSSSS SSSSSSSS SSSSSSSSS n', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 11, 45, 6);
  const format = new DateTimeFormat().of('m s S SS SSSS SSSSS SSSSSS SSSSSSS SSSSSSSS SSSSSSSSS n');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '45 6 0 00 0000 00000 000000 0000000 00000000 000000000 1652163306000000');
});

test('DateTimeFormatter format test KK k K kk a Hours', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 0o0, 45, 6);
  const format = new DateTimeFormat().of('KK k K kk a');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '12 0 12 00 AM');
});

test('DateTimeFormatter format test q D DD DDD', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 0o0, 45, 6);
  const format = new DateTimeFormat().of('q D DD DDD');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, '2 99 99 099');
});

test('DateTimeFormatter format test GGGG GGGGG w ww W', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 0o0, 45, 6);
  const format = new DateTimeFormat().of('GGGG GGGGG w ww W');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, 'Anno Domini A 16 16 3');
});

test('DateTimeFormatter format test E EEEE EEEEE e ee eee', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 0o0, 45, 6);
  const format = new DateTimeFormat().of('E EEEE EEEEE e ee eee');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, 'Sun Sunday S 1 01 Sun');
});

test('DateTimeFormatter format test ZZZZ ZZZZZ P', async (t) => {
  const dateTime = new DateTime(2022, 0o4, 10, 0o0, 45, 6);
  const format = new DateTimeFormat().of('ZZZZ ZZZZZ P');
  const dateTimeFormat = DateTimeFormatter.init.ofPattern(format).format(dateTime);
	t.is(dateTimeFormat, 'GMT Z th');
});
