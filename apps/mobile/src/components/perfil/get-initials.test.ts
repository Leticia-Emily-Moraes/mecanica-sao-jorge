import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('should return the first letter of the first and last names in upper case', () => {
    expect(getInitials('João da Silva')).toBe('JS');
  });

  it('should return a single letter when the name has only one word', () => {
    expect(getInitials('ana')).toBe('A');
  });

  it('should ignore extra spaces around and between words', () => {
    expect(getInitials('  Ana   Beatriz  Souza ')).toBe('AS');
  });

  it('should keep accented initials intact', () => {
    expect(getInitials('érica álvares')).toBe('ÉÁ');
  });

  it('should return an empty text when the name is blank', () => {
    expect(getInitials('   ')).toBe('');
  });
});
