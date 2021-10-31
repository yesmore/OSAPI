import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import * as requestIp from 'request-ip'

export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    let rex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/

    if (req.clientIp)
      return rex.exec(req.clientIp)[0];
    return rex.exec(requestIp.getClientIp(req))[0];
  }
)

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};
