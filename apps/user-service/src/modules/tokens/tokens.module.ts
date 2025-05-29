import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalAccessEntity } from './entities/token.entity';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([PersonalAccessEntity]),
        JwtModule.register({})
    ],
    providers: [TokensService],
    exports: [TokensService]
})
export class TokensModule {}
