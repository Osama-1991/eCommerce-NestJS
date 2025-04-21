import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UploadCloudFileService, TokenService, Token } from '../z_index';
import { userModel, UserRepositoryService } from 'src/DB/z_index';
@Global()
@Module({
  imports: [userModel],
  providers: [
    UserRepositoryService,
    JwtService,
    TokenService,
    UploadCloudFileService,
    Token,
  ],
  exports: [
    userModel,
    UserRepositoryService,
    TokenService,
    UploadCloudFileService,
    Token,
  ],
})
export class GlobalAuthProviderModule {}
