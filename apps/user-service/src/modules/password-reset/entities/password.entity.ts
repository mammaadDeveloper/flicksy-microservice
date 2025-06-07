import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PasswordResetTokenEnum } from 'src/shared/enums/token.enum';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('password_reset_tokens')
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({
    type: 'enum',
    enum: PasswordResetTokenEnum,
    default: PasswordResetTokenEnum.LINK,
  })
  type: PasswordResetTokenEnum;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
