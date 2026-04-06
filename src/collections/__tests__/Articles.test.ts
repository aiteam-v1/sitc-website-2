import { Articles } from '../Articles';

describe('Articles Collection', () => {
  it('should have the correct slug', () => {
    expect(Articles.slug).toBe('articles');
  });

  it('should allow public read access', () => {
    expect(Articles.access?.read?.()).toBe(true);
  });
});
