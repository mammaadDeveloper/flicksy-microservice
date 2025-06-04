import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class HashingService{
    hash(text: string){
        return createHash('sha256').update(text).digest('hex');
    }

    compare(text: string, hashed: string){
        const rawHashed = this.hash(text);
        return rawHashed === hashed;
    }
}