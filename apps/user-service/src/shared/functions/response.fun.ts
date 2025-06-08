export type ResourceObject<Attributes = any, Relationships = any> = {
  type: string;
  id?: string | number;
  attributes: Attributes;
  relationships?: Relationships;
}
export interface ResponsePayload {
  status?: string;
  message: string;
  data?: ResourceObject | ResourceObject[];
  meta?: Record<string, any>;
  links?: Record<string, any>;
}

export function response(payload: ResponsePayload) {
  return { __formatted: true, ...payload };
}
