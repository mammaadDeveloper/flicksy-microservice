import { MovieEntity } from 'src/modules/movies/entities/movies.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posters')
export class PosterEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'file_id' })
  fileId: string;

  @Column()
  filename: string;

  @Column({ type: 'enum', enum: ['poster', 'thumbnail', 'cover'] })
  type: 'poster' | 'thumbnail' | 'cover';

  @Column({ nullable: true })
  mimetype?: string;

  @Column({ nullable: true })
  size?: number;

  @ManyToOne(() => MovieEntity, (movie) => movie.posters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
