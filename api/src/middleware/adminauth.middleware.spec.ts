import { AdminauthMiddleware } from './adminauth.middleware';

describe('AdminauthMiddleware', () => {
  it('should be defined', () => {
    expect(new AdminauthMiddleware()).toBeDefined();
  });
});
