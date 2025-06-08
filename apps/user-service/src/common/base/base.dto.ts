import { instanceToPlain } from "class-transformer";

export abstract class BaseDto {
  toJSON() {
    const plain = instanceToPlain(this, {
      exposeUnsetFields: false,
    });

    return Object.fromEntries(
      Object.entries(plain).filter(([_, value]) => value !== null && value !== undefined),
    );
  }
}