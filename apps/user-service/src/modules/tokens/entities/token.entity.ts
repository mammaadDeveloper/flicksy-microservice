import { UserEntity } from "src/modules/users/entities/user.entity";
import { hashString } from "src/shared/utils/hash.util";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

@Tree('materialized-path')
@Entity('personal_access_tokens')
export class PersonalAccessEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'enum', enum: ['access', 'refresh'], default: 'refresh'})
    type: 'access' | 'refresh';

    @Column({name: 'jwt_id', type: 'uuid', unique: true})
    jti: string;

    @Column()
    token: string;

    @ManyToOne(() => UserEntity, user => user.tokens, {cascade: true})
    @JoinColumn({name: 'user_id'})
    user: UserEntity;

    @TreeChildren()
    children: PersonalAccessEntity[];

    @TreeParent({onDelete: 'CASCADE'})
    @JoinColumn({name: 'parent_id'})
    parent: PersonalAccessEntity;

    @Column({name: 'is_revoked', default: false})
    isRevoked: boolean;

    @Column({name: 'expired_at', type: 'timestamp'})
    expiredAt: Date;
    
    @Column({name: 'last_used_at', type: 'timestamp', nullable: true})
    lastUsedAt: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @BeforeInsert()
    hashToken(){
        this.token = hashString(this.token);
    }
}