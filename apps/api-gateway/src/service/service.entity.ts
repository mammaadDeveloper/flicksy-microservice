import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('services')
export class MicroServiceEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: 'base_url'})
    baseUrl: string;

    @Column({name: 'is_protected', default: false})
    isProtected: boolean;
}