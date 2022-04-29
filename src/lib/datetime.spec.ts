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

test('DateTime() convert from JS Date() throws error', async (t) => {
  const error = t.throws(() => {
		DateTime.convert(null);
	}, {instanceOf: Error});

	t.is(error.message, 'A date is required');
});

test('DateTime() convert from JS Date() function throws error', async (t) => {
  const dateJs = {"getDate": ""}
  const error = t.throws(() => {
		DateTime.convert(dateJs as unknown as Date);
	}, {instanceOf: Error});

	t.is(error.message, 'A date is required');
});

test('DateTime() clone() is same', async (t) => {
  const dateTime = new DateTime();
  t.is(dateTime.clone.toDateString(), dateTime.toDateString());
});


test('DateTime() check seconds', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(20, dateTime.seconds);
  dateTime.seconds = 54;
  t.is(54, dateTime.seconds);
});

test('DateTime() check minutes', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(12, dateTime.minutes);
  dateTime.minutes = 54;
  t.is(54, dateTime.minutes);
});

test('DateTime() check hours', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(10, dateTime.hours);
  dateTime.hours = 2;
  t.is(2, dateTime.hours);
});

test('DateTime() check date and date formatted', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(10, dateTime.date);
  t.is('10', dateTime.dateFormatted);
  dateTime.date = 2;
  t.is(2, dateTime.date);
  t.is('02', dateTime.dateFormatted);
});

test('DateTime() check week', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(16, dateTime.week);
});

test('DateTime() check weekDay', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(0, dateTime.weekDay);
});

test('DateTime() check date and date month', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(3, dateTime.month);
  t.is('03', dateTime.monthFormatted);
  dateTime.month = 10;
  t.is(10, dateTime.month);
  t.is('10', dateTime.monthFormatted);
});

test('DateTime() check year', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(2022, dateTime.year);
  dateTime.year = 2021;
  t.is(2021, dateTime.year);
});

test('DateTime() check meridiem of AM and PM', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is('AM', dateTime.meridiem());
  dateTime.hours = 23;
  t.is('PM', dateTime.meridiem());
});

test('DateTime() week number', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(15, dateTime.weekNumber);
});

test('DateTime() check for leap year false', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.false(dateTime.isLeapYear());
});

test('DateTime() check seconds epoch', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(1649565741, dateTime.secondsSinceEpoch());
});

test('DateTime() check milliseconds epoch', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(1649565740852, dateTime.millisecondsSinceEpoch());
});

test('DateTime() check nanoSeconds', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(1649565740852000, dateTime.nanoSeconds);
});
