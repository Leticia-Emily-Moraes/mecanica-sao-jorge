import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('should return the first letter of the first and last names in upper case', () => {
    expect(getInitials('João da Silva')).toBe('JS');
  });

  it('should return a single letter when the name has only one word', () => {
    expect(getInitials('ana')).toBe('A');
    expect(getInitials('Ana')).toBe('A');
  });

  it('should skip the particle between the names (Maria de Souza Lima = ML)', () => {
    expect(getInitials('Maria de Souza Lima')).toBe('ML');
  });

  it.each(['da', 'de', 'do', 'dos', 'das'])(
    'should ignore the particle "%s" as a last name',
    (particle) => {
      expect(getInitials(`Maria ${particle}`)).toBe('M');
    },
  );

  it('should ignore a leading particle and match it regardless of case', () => {
    expect(getInitials('De Souza')).toBe('S');
    expect(getInitials('Pedro DOS Santos')).toBe('PS');
  });

  it('should keep the particles when the text has nothing else, so the avatar is never blank', () => {
    expect(getInitials('da')).toBe('D');
  });

  it('should ignore extra spaces around and between words', () => {
    expect(getInitials('  Ana   Beatriz  Souza ')).toBe('AS');
  });

  it('should keep accented initials intact', () => {
    expect(getInitials('érica álvares')).toBe('ÉÁ');
  });

  it('should return an empty text when the name is blank', () => {
    expect(getInitials('   ')).toBe('');
    expect(getInitials('')).toBe('');
  });
});
