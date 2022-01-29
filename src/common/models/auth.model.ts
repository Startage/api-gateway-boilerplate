import { RefreshTokenModel } from '@/common/models/refresh-token.model';
import { UserModel } from '@/common/models/user.model';

export type AuthModel = {
  user: UserModel;
  refreshToken: RefreshTokenModel;
};
