export interface ResourceObject<Attributes = any, Relationships = any> {
  type: string;
  id?: string | number;
  attributes: Attributes;
  relationships?: Relationships;
}
export interface ResponsePayload<T = ResourceObject<any, any> | ResourceObject<any, any>[]> {
  //   statusCode: number;
  status?: string;
  //   success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;
  links?: Record<string, any>;
}

export function validateResourceObject(obj: any): asserts obj is ResourceObject {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error("Invalid resource object: value is not an object");
  }

  if (typeof obj.type !== 'string' || obj.type.trim() === '') {
    throw new Error("Invalid resource object: 'type' must be a non-empty string");
  }

  if (!('attributes' in obj)) {
    throw new Error("Invalid resource object: 'attributes' is required");
  }

  if (typeof obj.attributes !== 'object' || obj.attributes === null) {
    throw new Error("Invalid resource object: 'attributes' must be an object or array");
  }

  if ('id' in obj && typeof obj.id !== 'string' && typeof obj.id !== 'number') {
    throw new Error("Invalid resource object: 'id' must be a string or number if provided");
  }

  if (
    'relationships' in obj &&
    typeof obj.relationships !== 'object' &&
    !Array.isArray(obj.relationships)
  ) {
    throw new Error("Invalid resource object: 'relationships' must be an object or array if provided");
  }
}



export function response<T = ResourceObject<any, any> | ResourceObject<any, any>[]>(payload: ResponsePayload<T>) {
  if (Array.isArray(payload.data)) {
    payload.data.forEach(validateResourceObject);
  } else {
    validateResourceObject(payload.data);
  }

  return { __formatted: true, ...payload };
}
