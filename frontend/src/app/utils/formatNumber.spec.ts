import { FormatNumber } from './formatNumber';

describe('FormatNumber ', () => {
  let formatNumber: FormatNumber;

  beforeEach(() => {
    formatNumber = new FormatNumber();
  });

  describe('transform', () => {
    it('should format number correctly', () => {
      const result = formatNumber.transform(1234);
      expect(result).toBe('1,234');
    });

    it('should format large number correctly', () => {
      const result = formatNumber.transform(1234567);
      expect(result).toBe('1,234,567');
    });

    it('should format decimal number correctly', () => {
      const result = formatNumber.transform(1234.56);
      expect(result).toBe('1,234.56');
    });

    it('should format zero correctly', () => {
      const result = formatNumber.transform(0);
      expect(result).toBe('0');
    });

    it('should format negative number correctly', () => {
      const result = formatNumber.transform(-1234);
      expect(result).toBe('-1,234');
    });

    it('should handle string number input', () => {
      const result = formatNumber.transform('1234');
      expect(result).toBe('1,234');
    });

    it('should handle string decimal input', () => {
      const result = formatNumber.transform('1234.56');
      expect(result).toBe('1,234.56');
    });

    it('should handle string zero input', () => {
      const result = formatNumber.transform('0');
      expect(result).toBe('0');
    });

    it('should return "0" for null input', () => {
      const result = formatNumber.transform(null);
      expect(result).toBe('0');
    });

    it('should return "0" for undefined input', () => {
      const result = formatNumber.transform(undefined);
      expect(result).toBe('0');
    });

    it('should return "0" for empty string input', () => {
      const result = formatNumber.transform('');
      expect(result).toBe('0');
    });

    it('should return "0" for invalid string input', () => {
      const result = formatNumber.transform('invalid');
      expect(result).toBe('0');
    });

    it('should return "0" for NaN input', () => {
      const result = formatNumber.transform(NaN);
      expect(result).toBe('0');
    });

    it('should handle string with spaces', () => {
      const result = formatNumber.transform('  1234  ');
      expect(result).toBe('1,234');
    });

    it('should handle very large numbers', () => {
      const result = formatNumber.transform(123456789012345);
      expect(result).toBe('123,456,789,012,345');
    });

    it('should handle negative string numbers', () => {
      const result = formatNumber.transform('-1234');
      expect(result).toBe('-1,234');
    });

    it('should handle fractional numbers less than 1', () => {
      const result = formatNumber.transform(0.123);
      expect(result).toBe('0.123');
    });

    it('should handle negative fractional numbers', () => {
      const result = formatNumber.transform(-0.123);
      expect(result).toBe('-0.123');
    });
  });
});
