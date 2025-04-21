import { tokenSignature, RoleTypes } from 'src/DB/z_index';

export class Token {
  constructor() {}

  public getTokenBearer = (prefix: string): RoleTypes => {
    switch (prefix) {
      case process.env.TOKEN_SIGNATURE_USER:
        return RoleTypes.user;
      case process.env.TOKEN_SIGNATURE_VENDOR:
        return RoleTypes.vendor;
      case process.env.TOKEN_SIGNATURE_ADMIN:
        return RoleTypes.admin;
      case process.env.TOKEN_SIGNATURE_SUPER_ADMIN:
        return RoleTypes.superAdmin;
      default:
        return RoleTypes.guest;
    }
  };

  public getTokenSignature = (role: RoleTypes): tokenSignature => {
    let accessSignature: string;
    let refreshSignature: string;

    switch (role) {
      case RoleTypes.user:
        accessSignature = process.env.USER_ACCESS_TOKEN_SIGNATURE as string;
        refreshSignature = process.env.USER_REFRESH_TOKEN_SIGNATURE as string;
        break;
      case RoleTypes.vendor:
        accessSignature = process.env.VENDOR_ACCESS_TOKEN_SIGNATURE as string;
        refreshSignature = process.env.VENDOR_REFRESH_TOKEN_SIGNATURE as string;
        break;
      case RoleTypes.admin:
        accessSignature = process.env.ADMIN_ACCESS_TOKEN_SIGNATURE as string;
        refreshSignature = process.env.ADMIN_REFRESH_TOKEN_SIGNATURE as string;
        break;
      case RoleTypes.superAdmin:
        accessSignature = process.env
          .SUPER_ADMIN_ACCESS_TOKEN_SIGNATURE as string;
        refreshSignature = process.env
          .SUPER_ADMIN_REFRESH_TOKEN_SIGNATURE as string;
        break;
      default:
        accessSignature = '';
        refreshSignature = '';
    }
    return { accessSignature, refreshSignature };
  };
}
