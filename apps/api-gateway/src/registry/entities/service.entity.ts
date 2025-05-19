import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('services')
export class Service{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 20, unique: true})
    name: string;

    @Column({type: 'varchar', length: 20})
    host: string;

    @Column()
    port: number;

    @Column({type: 'varchar', length: 20})
    prefix: string;

    @Column()
    status: 'healthy' | 'unhealthy' | 'down';

    @CreateDateColumn({name: 'crated_at'})
    cratedAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updateAt: Date;
}