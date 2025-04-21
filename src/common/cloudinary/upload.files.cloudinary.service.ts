import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

interface IImageOutput {
  secure_url: string;
  public_id: string;
}

const CloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
};

@Injectable()
export class UploadCloudFileService {
  private cloudinary = CloudinaryConfig();

  async uploadSingleFile(
    file: string,
    options?: UploadApiOptions,
  ): Promise<IImageOutput> {
    const data: IImageOutput = await this.cloudinary.uploader.upload(
      file,
      options,
    );
    return { secure_url: data.secure_url, public_id: data.public_id };
  }

  async uploadMultipleFiles(
    files: string[],
    options?: UploadApiOptions,
  ): Promise<IImageOutput[]> {
    const Images: IImageOutput[] = [];
    for (const path of files) {
      const data = await this.uploadSingleFile(path, options);
      Images.push({ secure_url: data.secure_url, public_id: data.public_id });
    }
    return Images;
  }

  async deleteFileByPublicId(public_id: string): Promise<any> {
    return await this.cloudinary.uploader.destroy(public_id);
  }

  async deleteFileByPrefix(prefix: string): Promise<void> {
    await this.cloudinary.api.delete_resources_by_prefix(prefix);
    await this.cloudinary.api.delete_folder(prefix);
  }
}
