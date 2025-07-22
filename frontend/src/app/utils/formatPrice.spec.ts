import { NairaFormat } from './formatPrice';

describe('Price -NairaFormat', () => {
  let nairaFormat: NairaFormat;

  beforeEach(() => {
    nairaFormat = new NairaFormat();
  });

  describe('transform', () => {
    it('should format number with naira symbol', () => {
      const result = nairaFormat.transform(1234);
      expect(result).toBe('₦1,234');
    });

    it('should format large number with naira symbol', () => {
      const result = nairaFormat.transform(1234567);
      expect(result).toBe('₦1,234,567');
    });

    it('should format decimal number with naira symbol', () => {
      const result = nairaFormat.transform(1234.56);
      expect(result).toBe('₦1,234.56');
    });

    it('should return "Free" when isFree is true', () => {
      const result = nairaFormat.transform(1000, true);
      expect(result).toBe('Free');
    });

    it('should return "Free" when value is 0', () => {
      const result = nairaFormat.transform(0);
      expect(result).toBe('Free');
    });

    it('should return "Free" when value is null', () => {
      const result = nairaFormat.transform(null);
      expect(result).toBe('Free');
    });

    it('should return "Free" when value is undefined', () => {
      const result = nairaFormat.transform(undefined);
      expect(result).toBe('Free');
    });

    it('should return "Free" when value is NaN', () => {
      const result = nairaFormat.transform(NaN);
      expect(result).toBe('Free');
    });

    it('should format negative number with naira symbol', () => {
      const result = nairaFormat.transform(-1234);
      expect(result).toBe('₦-1,234');
    });

    it('should handle very large numbers', () => {
      const result = nairaFormat.transform(123456789012345);
      expect(result).toBe('₦123,456,789,012,345');
    });

    it('should handle fractional numbers less than 1', () => {
      const result = nairaFormat.transform(0.99);
      expect(result).toBe('₦0.99');
    });

    it('should handle very small positive numbers', () => {
      const result = nairaFormat.transform(0.01);
      expect(result).toBe('₦0.01');
    });
  });
});
