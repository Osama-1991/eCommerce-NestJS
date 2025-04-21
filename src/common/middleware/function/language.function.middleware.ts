import { NextFunction, Request, Response } from 'express';

export const setLanguage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.headers['accept-language'] = req.headers['accept-language']
    ? req.headers['accept-language']
    : (process.env.APP_DEFAULT_LANGUAGE as string);
  return next();
};
