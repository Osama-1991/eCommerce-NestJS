import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Auth, MulterCloudOption, fileFormat } from 'src/common/z_index';
import { DeleteImageDto, updateProfileInfoDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUser, RoleTypes, UserDoc } from '../../DB/z_index';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Auth([
    RoleTypes.user,
    RoleTypes.admin,
    RoleTypes.superAdmin,
    RoleTypes.vendor,
  ])
  @Get('profile')
  async profile(@User() user: UserDoc): Promise<UserDoc> {
    return await this.userService.profile(user);
  }

  @Auth([
    RoleTypes.user,
    RoleTypes.admin,
    RoleTypes.superAdmin,
    RoleTypes.vendor,
  ])
  @Patch('update-profile-info')
  async update(
    @User() user: UserDoc,
    @Body() body: updateProfileInfoDto,
  ): Promise<IUser> {
    return await this.userService.update(user, body);
  }

  @Auth([
    RoleTypes.user,
    RoleTypes.admin,
    RoleTypes.superAdmin,
    RoleTypes.vendor,
  ])
  @UseInterceptors(
    FileInterceptor(
      'image',
      MulterCloudOption({
        fileValidator: fileFormat.image,
      }),
    ),
  )
  @Patch('update-profile-img')
  async updateProfileImg(
    @User() user: UserDoc,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.userService.updateProfileImg(user, image);
  }

  @Auth([
    RoleTypes.user,
    RoleTypes.admin,
    RoleTypes.superAdmin,
    RoleTypes.vendor,
  ])
  @Delete('delete-profile-img')
  async deleteProfileImage(
    @User() user: UserDoc,
    @Body() body: DeleteImageDto,
  ) {
    return await this.userService.deleteProfileImage(user, body);
  }
}
