import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalAccessEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PersonalAccessEntity]),
    ],
    providers: [TokensService],
    exports: [TokensService]
})
export class TokensModule {}
