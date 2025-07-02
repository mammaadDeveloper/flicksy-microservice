import { MovieEntity } from 'src/modules/movies/entities/movies.entity';
import { VideoEncodingEnum, VideoQualityEnum } from 'src/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sources')
export class SourceEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: VideoQualityEnum })
  quality: VideoQualityEnum;

  @Column({ default: 0 })
  size: number;

  @Column({ name: 'file_id', nullable: true })
  file?: string;

  @Column({ type: 'simple-array', nullable: true })
  subtileFileIds: string[];

  @Column({
    type: 'enum',
    enum: VideoEncodingEnum,
    default: VideoEncodingEnum.H264,
  })
  encoding: VideoEncodingEnum;

  @ManyToOne(() => MovieEntity, (movie) => movie.sources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: MovieEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
