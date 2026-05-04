import type { Request } from 'express';

export const getReqMainInfo: (req: Request) => {
  [prop: string]: unknown;
} = (req) => {
  if (req === undefined) {
    return {};
  }
  // 获取 IP
  let xRealIp: string | string[] | undefined = undefined,
    xForwardedFor: string | string[] | undefined = undefined;
  if ('headers' in req) {
    xRealIp = req.headers['X-Real-IP'];
    xForwardedFor = req.headers['X-Forwarded-For'];
  }
  let cIp: string | undefined = undefined;
  if ('ip' in req) {
    cIp = req.ip;
  }
  const { remoteAddress } = req.connection || {};
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

  return {
    url: req.url,
    host: req.headers.host,
    ip,
    method: req.method,
    query: req.query,
    body: req.body,
  };
};
