import { PersonalAccessEntity } from "src/modules/tokens/entities/token.entity";
import { hashString } from "src/shared/utils/hash.util";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 20})
    username: string;

    @Column({type: 'varchar', length: 20, nullable: true, unique: true})
    phone?: string;

    @Column({type: 'varchar', length: 30, nullable: true, unique: true})
    email?: string;

    @Column({type: 'varchar', length: 100})
    password: string;

    @OneToMany(() => PersonalAccessEntity, token => token.user)
    tokens: PersonalAccessEntity[];

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date | null;

    @BeforeInsert()
    hashPassword(){
        this.password = hashString(this.password);
    }
}