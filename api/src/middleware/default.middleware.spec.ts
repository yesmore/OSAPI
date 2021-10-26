import { DefaultMiddleware } from './default.middleware';

describe('DefaultMiddleware', () => {
  it('should be defined', () => {
    expect(new DefaultMiddleware()).toBeDefined();
  });
});
