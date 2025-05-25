import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 20})
    username: string;

    @Column({type: 'varchar', length: 20, unique: true})
    phone: string;

    @Column({type: 'varchar', length: 30, unique: true})
    email: string;

    @Column({type: 'varchar', length: 100})
    password: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date | null;
}