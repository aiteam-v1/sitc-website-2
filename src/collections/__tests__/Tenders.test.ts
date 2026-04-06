import { Tenders } from '../Tenders';

describe('Tenders Collection', () => {
  it('should allow public read access', () => {
    expect(Tenders.access?.read?.()).toBe(true);
  });
});
