import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { fileFormat, IMulterParameters } from './attachment.types';

// --------------------------- MULTER CLOUD STORAGE ------------------------------------

export const MulterCloudOption = ({
  fileValidator = fileFormat.image,
  fileSize = 1024 * 1024 * 2,
}: IMulterParameters) => {
  return {
    storage: diskStorage({}),
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
