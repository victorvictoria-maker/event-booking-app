import { Pluralize } from './pluralize';

describe('Pluralize Pipe', () => {
  let pluralize: Pluralize;

  beforeEach(() => {
    pluralize = new Pluralize();
  });

  describe('transform', () => {
    it('should return singular form for count of 1', () => {
      const result = pluralize.transform(1, 'item');
      expect(result).toBe('1 item');
    });

    it('should return plural form for count of 0', () => {
      const result = pluralize.transform(0, 'item');
      expect(result).toBe('0 items');
    });

    it('should return plural form for count greater than 1', () => {
      const result = pluralize.transform(5, 'item');
      expect(result).toBe('5 items');
    });

    it('should use custom plural form when provided', () => {
      const result = pluralize.transform(2, 'child', 'children');
      expect(result).toBe('2 children');
    });

    it('should use custom plural form for count of 0', () => {
      const result = pluralize.transform(0, 'child', 'children');
      expect(result).toBe('0 children');
    });

    it('should use singular form for count of 1 even with custom plural', () => {
      const result = pluralize.transform(1, 'child', 'children');
      expect(result).toBe('1 child');
    });

    it('should handle decimal numbers as plural', () => {
      const result = pluralize.transform(1.5, 'item');
      expect(result).toBe('1.5 items');
    });

    it('should handle decimal numbers with custom plural', () => {
      const result = pluralize.transform(2.5, 'child', 'children');
      expect(result).toBe('2.5 children');
    });

    it('should return empty string for non-number input', () => {
      const result = pluralize.transform('invalid' as any, 'item');
      expect(result).toBe('');
    });

    it('should return empty string for null input', () => {
      const result = pluralize.transform(null as any, 'item');
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = pluralize.transform(undefined as any, 'item');
      expect(result).toBe('');
    });

    it('should handle zero with custom plural', () => {
      const result = pluralize.transform(0, 'person', 'people');
      expect(result).toBe('0 people');
    });

    it('should handle large numbers', () => {
      const result = pluralize.transform(1000000, 'item');
      expect(result).toBe('1000000 items');
    });

    it('should handle very small decimal numbers', () => {
      const result = pluralize.transform(0.1, 'item');
      expect(result).toBe('0.1 items');
    });

    it('should handle negative decimal numbers', () => {
      const result = pluralize.transform(-0.5, 'item');
      expect(result).toBe('-0.5 items');
    });

    it('should handle empty string as singular word', () => {
      const result = pluralize.transform(1, '');
      expect(result).toBe('1 ');
    });

    it('should handle empty string as singular word with plural', () => {
      const result = pluralize.transform(2, '');
      expect(result).toBe('2 s');
    });

    it('should handle empty string as plural word', () => {
      const result = pluralize.transform(2, 'item', '');
      expect(result).toBe('2 items');
    });
  });
});
