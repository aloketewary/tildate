import test from 'ava';

import { DateTime } from './datetime';
import { UnitOfDateTime } from './util/unit-of-datetime.type';

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

test('DateTime() check for leap year true', async (t) => {
  const dateTime = new DateTime(2004, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime.isLeapYear());
});

test('DateTime(2000) check for leap year true', async (t) => {
  const dateTime = new DateTime(2000, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime.isLeapYear());
});

test('DateTime() check seconds epoch', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.truthy(!!dateTime.secondsSinceEpoch());
});

test('DateTime() check milliseconds epoch', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.truthy(!!dateTime.millisecondsSinceEpoch());
});

test('DateTime() check nanoSeconds', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.truthy(!!dateTime.nanoSeconds);
});

test('DateTime(2023, 03) is Between DateTime(2021, 03) year', async (t) => {
  const dateTime = new DateTime(2023, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime3 = new DateTime(2021, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime2.isBetween(dateTime, dateTime3, 'year'));
});

test('DateTime(2023, 03) is Between not inclusive DateTime(2021, 03) year', async (t) => {
  const dateTime = new DateTime(2023, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime3 = new DateTime(2021, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime2.isBetween(dateTime, dateTime3, 'year', "[]"));
});

test('DateTime(2021, 03) is Between DateTime(2023, 03) year', async (t) => {
  const dateTime = new DateTime(2021, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime3 = new DateTime(2023, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime2.isBetween(dateTime, dateTime3, 'year', "[]"));
});


test('DateTime(2021, 03) is not Between DateTime(2023, 03) year', async (t) => {
  const dateTime = new DateTime(2021, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2025, 0o3, 10, 10, 12, 20, 852);
  const dateTime3 = new DateTime(2023, 0o3, 10, 10, 12, 20, 852);
  t.false(dateTime2.isBetween(dateTime, dateTime3, 'year'));
});

test('DateTime(2022, 03) is same DateTime(2022, 03) year', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime2.isSame(dateTime, 'year'));
});

test('DateTime(2022, 03) is same DateTime(2022, 03) with out unit', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.true(dateTime2.isSame(dateTime));
});

test('DateTime(2022, 03) is same DateTime(2022, 03) undefined unit throws error', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const error = t.throws(() => {
		dateTime.isSame(dateTime2, 'years' as unknown as UnitOfDateTime);
	}, {instanceOf: Error});

	t.is(error.message, 'Unit \'years\' is not valid');
});

test('DateTime(2022, 03) start of DateTime(2022, 03) with month', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(dateTime.toDateString(), dateTime2.startOf('seconds').toDateString());
  t.is(dateTime.toDateString(), dateTime2.startOf('minutes').toDateString());
  t.is(dateTime.toDateString(), dateTime2.startOf('hours').toDateString());
  t.is(dateTime.toDateString(), dateTime2.startOf('date').toDateString());
  t.is('Fri Apr 01 2022', dateTime2.startOf('month').toDateString());
  t.is('Sat Jan 01 2022', dateTime2.startOf('year').toDateString());
  t.is('Sun Dec 26 2021', dateTime2.startOf('weekDay').toDateString());
});

test('DateTime(2022, 03) end of DateTime(2022, 03) with month', async (t) => {
  const dateTime = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  const dateTime2 = new DateTime(2022, 0o3, 10, 10, 12, 20, 852);
  t.is(dateTime.toDateString(), dateTime2.endOf('seconds').toDateString());
  t.is(dateTime.toDateString(), dateTime2.endOf('minutes').toDateString());
  t.is(dateTime.toDateString(), dateTime2.endOf('hours').toDateString());
  t.is(dateTime.toDateString(), dateTime2.endOf('date').toDateString());
  t.is('Sat Apr 30 2022', dateTime2.endOf('month').toDateString());
  t.is('Fri Mar 31 2023', dateTime2.endOf('year').toDateString());
  t.is('Sat Apr 01 2023', dateTime2.endOf('weekDay').toDateString());
});
