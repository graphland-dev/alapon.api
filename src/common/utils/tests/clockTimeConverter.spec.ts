import { clockTimeToSeconds, secondsToClockTime } from '../clockTimeConverter';

describe('utils/clockTimeToSeconds', () => {
  // Returns the correct total seconds for a valid clock time string in the format "HH:MM".
  it('should return the correct total seconds when given a valid clock time string', () => {
    const clockTime = '12:34';
    const expected = 45240;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Returns 0 total seconds for the clock time string "00:00".
  it('should return 0 total seconds when given the clock time string "00:00"', () => {
    const clockTime = '00:00';
    const expected = 0;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Returns the correct total seconds for the clock time string "23:59".
  it('should return the correct total seconds when given the clock time string "23:59"', () => {
    const clockTime = '23:59';
    const expected = 86340;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Returns the correct total seconds for the clock time string "12:00".
  it('should return the correct total seconds when given the clock time string "12:00"', () => {
    const clockTime = '12:00';
    const expected = 43200;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Returns the correct total seconds for the clock time string "01:30".
  it('should return the correct total seconds when given the clock time string "01:30"', () => {
    const clockTime = '01:30';
    const expected = 5400;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Returns the correct total seconds for the clock time string "10:10".
  it('should return the correct total seconds when given the clock time string "10:10"', () => {
    const clockTime = '10:10';
    const expected = 36600;
    const result = clockTimeToSeconds(clockTime);
    expect(result).toBe(expected);
  });

  // Throws an error for an invalid clock time string with letters instead of numbers.
  it('should throw an error when given an invalid clock time string with letters instead of numbers', () => {
    const clockTime = 'ab:cd';
    expect(() => {
      clockTimeToSeconds(clockTime);
    }).toThrowError('Invalid clock time: ab:cd');
  });

  // Throws an error for an invalid clock time string with only one number.
  it('should throw an error when given an invalid clock time string with only one number', () => {
    const clockTime = '12';
    expect(() => {
      clockTimeToSeconds(clockTime);
    }).toThrowError('Invalid clock time: 12');
  });

  // Throws an error for an invalid clock time string with negative total seconds.
  it('should throw an error when given an invalid clock time string with negative total seconds', () => {
    const clockTime = '-01:30';
    expect(() => {
      clockTimeToSeconds(clockTime);
    }).toThrowError('Invalid clock time range: -01:30');
  });

  // Throws an error for an invalid clock time string with total seconds greater than or equal to 86400.
  it('should throw an error when given an invalid clock time string with total seconds greater than or equal to 86400', () => {
    const clockTime = '24:00';
    expect(() => {
      clockTimeToSeconds(clockTime);
    }).toThrowError('Invalid clock time range: 24:00');
  });

  // Throws an error for an invalid clock time string with hours greater than 23.
  it('should throw an error when given an invalid clock time string with hours greater than 23', () => {
    const clockTime = '25:30';
    expect(() => {
      clockTimeToSeconds(clockTime);
    }).toThrowError('Invalid clock time range: 25:30');
  });
});

// Generated by CodiumAI

describe('utils/secondsToClockTime', () => {
  // Returns a string in the format 'hh:mm' for valid input between 0 and 86399.
  it('should return the correct clock time when the input is between 0 and 86399', () => {
    expect(secondsToClockTime(3600)).toBe('01:00');
    expect(secondsToClockTime(7200)).toBe('02:00');
    expect(secondsToClockTime(18000)).toBe('05:00');
    expect(secondsToClockTime(43200)).toBe('12:00');
    expect(secondsToClockTime(86399)).toBe('23:59');
  });

  // Returns a string in the format '00:00' for input 0.
  it('should return "00:00" when the input is 0', () => {
    expect(secondsToClockTime(0)).toBe('00:00');
  });

  // Returns a string in the format '23:59' for input 86399.
  it('should return "23:59" when the input is 86399', () => {
    expect(secondsToClockTime(86399)).toBe('23:59');
  });

  // Throws an error for input less than 0.
  it('should throw an error when the input is less than 0', () => {
    expect(() => secondsToClockTime(-1)).toThrow('Invalid input range: -1');
    expect(() => secondsToClockTime(-100)).toThrow('Invalid input range: -100');
  });

  // Throws an error for input greater than or equal to 86400.
  it('should throw an error when the input is greater than or equal to 86400', () => {
    expect(() => secondsToClockTime(86400)).toThrow(
      'Invalid input range: 86400',
    );
    expect(() => secondsToClockTime(100000)).toThrow(
      'Invalid input range: 100000',
    );
  });

  // Returns a string in the format '01:00' for input 3600.
  it('should return "01:00" when the input is 3600', () => {
    expect(secondsToClockTime(3600)).toBe('01:00');
  });
});
