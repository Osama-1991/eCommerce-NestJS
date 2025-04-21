import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UploadCloudFileService, Decrypt } from 'src/common/z_index';
import { UserRepositoryService, UserDoc, IUser } from 'src/DB/z_index';
import { DeleteImageDto, updateProfileInfoDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}
  async profile(user: UserDoc): Promise<UserDoc> {
    const User: UserDoc = await this.userRepositoryService.checkUserExistById(
      user._id,
      'fName lName DOB gender address phone -_id',
    );
    const phone = Decrypt(user.phone);
    User.toObject();
    User.phone = phone;
    return User;
  }

  async update(user: UserDoc, body: updateProfileInfoDto): Promise<IUser> {
    if (Object.keys(body).length == 0) {
      throw new BadRequestException('cannot send empty body');
    }
    const { fName, lName, DOB, gender, address } = body;
    const updatedUser = await this.userRepositoryService.findOneAndUpdate({
      filter: { _id: user._id, isConfirmed: true, isDeleted: false },
      update: {
        fName,
        lName,
        DOB,
        gender,
        address,
      },
    });
    if (!updatedUser) {
      throw new BadRequestException('User not found or not confirmed');
    }
    return updatedUser;
  }

  async updateProfileImg(
    user: UserDoc,
    image: Express.Multer.File,
  ): Promise<IUser | null> {
    if (!image) {
      throw new BadRequestException('No file uploaded');
    }
    await this.userRepositoryService.checkUserExistById(user._id);

    if (user?.profile_img?.public_id) {
      await this.uploadCloudFileService.deleteFileByPublicId(
        user.profile_img.public_id,
      );
    }

    const profile_img = await this.uploadCloudFileService.uploadSingleFile(
      image.path,
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/Users/${user.email}`,
      },
    );

    const updatedUser = await this.userRepositoryService.findByIdAndUpdate({
      id: user._id,
      update: {
        $set: { profile_img },
      },
    });

    return updatedUser;
  }

  async deleteProfileImage(
    user: UserDoc,
    body: DeleteImageDto,
  ): Promise<IUser | null> {
    await this.userRepositoryService.checkUserExistById(user._id);
    const { public_id } = body;
    const userExist = await this.userRepositoryService.checkUserExistById(
      user._id,
    );
    if (!userExist) {
      throw new BadRequestException('User not found');
    }
    if (user.profile_img.public_id !== public_id) {
      throw new NotFoundException('public_id not found');
    }
    const updatedUser = await this.userRepositoryService.findOneAndUpdate({
      filter: { _id: user._id },
      update: {
        $unset: {
          profile_img: 1,
        },
      },
    });
    await this.uploadCloudFileService.deleteFileByPublicId(public_id);
    return updatedUser;
  }
}
