import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { IMulterParameters } from './attachment.types';

// --------------------------- MULTER LOCAL STORAGE ------------------------------------

export const MulterOption = ({
  path = 'public',
  fileValidator = [],
  fileSize = 1024 * 50,
}: IMulterParameters) => {
  const baseURL: string = `uploads/${path}`;

  return {
    storage: diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const fullURL: string = resolve(`./${baseURL}/${req['user']._id}`);
        if (!existsSync(fullURL)) {
          mkdirSync(fullURL, { recursive: true });
        }
        cb(null, fullURL);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, fileName: string) => void,
      ) => {
        const fileName = Date.now() + '-' + file.originalname;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        file['finalPath'] = `${baseURL}/${req['user']._id}/${fileName}`;
        cb(null, fileName);
      },
    }),
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      if (!fileValidator.includes(file.mimetype)) {
        return cb(new BadRequestException('Invalid file format'), false);
      }
      cb(null, true);
    },
    limits: { fileSize },
  };
};
