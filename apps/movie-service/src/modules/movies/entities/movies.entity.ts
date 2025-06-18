import { SourceEntity } from "src/modules/sources/entities/sources.entity";
import { TrailerEntity } from "src/modules/trailers/entities/trailers.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column()
    director: string;

    @Column({type: 'int'})
    year: number;

    @Column({type: 'timestamp', name: 'release_date', nullable: true})
    releaseDate?: Date;

    @Column({nullable: true})
    poster?: string;

    @OneToMany(() => SourceEntity, source => source.movie)
    sources: SourceEntity[];

    @OneToMany(() => TrailerEntity, trailer => trailer.movie)
    trailers: TrailerEntity[];

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date;
}