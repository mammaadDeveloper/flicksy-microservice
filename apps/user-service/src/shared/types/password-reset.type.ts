import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordResetTokenEnum } from '../enums/token.enum';

export type PasswordCredentialsType = {
  token: string;
  type: PasswordResetTokenEnum;
  user?: UserEntity;
};
