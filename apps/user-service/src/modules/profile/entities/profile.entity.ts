import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from 'src/shared/enums/profile.enum';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender?: GenderEnum;

  @Column({nullable: true})
  avatar?: string;

  @Column({name: 'biography',nullable: true})
  bio?: string;

  @Column({nullable: true})
  address?: string;
}
