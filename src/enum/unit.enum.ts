export enum UnitOfDateTime {
    SECONDS = 'seconds',
    MINUTES = 'minutes',
    HOURS = 'hours',
    DATE = 'date',
    MONTH = 'month',
    YEAR = 'year',
    WEEKDAY = 'weekDay'
}

/// The different intervals of time that can be counted by the
/// [DateTimeFormat.relative] method.
export enum UnitOfTime {
    /// Years
    year,
  
    /// Months
    month,
  
    /// Weeks
    week,
  
    /// Days
    day,
  
    /// Hours
    hour,
  
    /// Minutes
    minute,
  
    /// Seconds
    second,
  
    /// Milliseconds
    millisecond,
  
    /// Microseconds
    microsecond,
  }