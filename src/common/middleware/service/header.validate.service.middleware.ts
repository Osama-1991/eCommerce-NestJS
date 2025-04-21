import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HeaderValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (
      !req.headers.authorization ||
      req.headers.authorization.split(' ').length !== 2
    ) {
      return res.status(401).json({ message: 'Invalid Authorization header' });
    }

    return next(); // call next middleware in chain
  }
}
