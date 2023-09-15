import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLogger implements NestMiddleware {
  private readonly logger = new Logger(RequestLogger.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, protocol, originalUrl } = request;
    const fullUrl = protocol + '://' + request.get('host') + originalUrl;
    const userAgent = request.get('user-agent') ?? 'unknown-user-agent';

    response.on('close', () => {
      this.logger.log(
        `Request: ${method} ${fullUrl} ${userAgent} ${ip}; Response status: ${response.statusCode}`,
      );
    });

    next();
  }
}
