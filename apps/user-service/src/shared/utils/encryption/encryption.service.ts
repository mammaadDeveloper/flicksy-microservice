import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private algorithm: string;
  private key: Buffer;
  private iv: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.key = crypto.scryptSync(
      configService.get('hashing.encryption.secret'),
      'salt',
      32,
    );
    this.iv = Buffer.alloc(
      configService.get<number>('hashing.encryption.iv_byte'),
      0,
    );
    this.algorithm = configService.get(
      'hashing.encryption.algorithm',
      'aes-256-cbc',
    );
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
