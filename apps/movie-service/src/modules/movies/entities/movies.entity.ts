import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('movies')
export class MovieEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'uuid'})
    slug: string;

    @Column({unique: true})
    title: string;

    @Column({length: 255})
    summary: string;

    @Column({type: 'text',nullable: true})
    description?: string;

    @Column({length: 4})
    year: string;

    @Column({type: 'timestamp', name: 'release_date', nullable: true})
    releaseDate?: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;
}