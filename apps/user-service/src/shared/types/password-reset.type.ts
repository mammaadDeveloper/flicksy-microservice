import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordResetTokenType } from './token.type';

export type PasswordExistsType = {
  token: string;
  type: PasswordResetTokenType;
  user?: UserEntity;
};
