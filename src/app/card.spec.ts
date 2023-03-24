import { Card } from './card';

describe('Card', () => {
  it('should create an instance', () => {
    expect(new Card('example name', 0, 'example category', 'example picture')).toBeTruthy();
  });
});
