import { timeFormatValidator } from './timeFormatValidator';

describe('timeFormatValidator', () => {
  it('should return null for empty value', () => {
    const result = timeFormatValidator({ value: '' });
    expect(result).toBeNull();
  });

  it('should return null for null value', () => {
    const result = timeFormatValidator({ value: null });
    expect(result).toBeNull();
  });

  it('should return null for valid time format (single digit hour)', () => {
    const result = timeFormatValidator({ value: '9:00 - 17:00' });
    expect(result).toBeNull();
  });

  it('should return null for valid time format (double digit hour)', () => {
    const result = timeFormatValidator({ value: '09:00 - 17:00' });
    expect(result).toBeNull();
  });

  it('should return error for invalid time format (missing dash)', () => {
    const result = timeFormatValidator({ value: '09:00 17:00' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });

  it('should return error for invalid hour (24)', () => {
    const result = timeFormatValidator({ value: '24:00 - 17:00' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });

  it('should return error for invalid minute (>59)', () => {
    const result = timeFormatValidator({ value: '09:60 - 17:00' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });

  it('should return error for completely invalid string', () => {
    const result = timeFormatValidator({ value: 'hello world' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });

  it('should return error for missing minutes', () => {
    const result = timeFormatValidator({ value: '09 - 17:00' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });

  it('should return error for invalid format with AM/PM', () => {
    const result = timeFormatValidator({ value: '9:00am - 5:00pm' });
    expect(result).toEqual({ invalidTimeFormat: true });
  });
});
