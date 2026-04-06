import { Products } from '../Products';

describe('Products Collection', () => {
  it('should allow public read access', () => {
    expect(Products.access?.read?.()).toBe(true);
  });
});
