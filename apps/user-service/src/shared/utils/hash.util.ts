import { createHash } from 'crypto';

export function hashString(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function compareHash(raw: string, hashed: string): boolean {
  const rawHashed = hashString(raw);
  return rawHashed == hashed;
}
