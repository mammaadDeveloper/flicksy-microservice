import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'jwt_id' })
  jti: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'logged_in_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loggedInAt: Date;

  @Column({ name: 'logged_out_at', type: 'timestamp', nullable: true })
  loggedOutAt?: Date;

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  isRevoked: boolean;

  @ManyToOne(() => UserEntity, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({name: 'expired_at', type: 'timestamp'})
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
