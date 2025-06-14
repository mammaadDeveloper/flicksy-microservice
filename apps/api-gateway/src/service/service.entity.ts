import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('services')
export class MicroServiceEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({name: 'base_url'})
    baseUrl: string;

    @Column({type: 'simple-json', name: 'protected_routes', nullable: true})
    protectedRoutes: string[];

    @Column({default: 'unknown'})
    status: 'up' | 'down' | 'degraded' | 'unknown';
}