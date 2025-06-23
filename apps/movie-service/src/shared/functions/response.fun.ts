export type ResourceObject<Attributes = any, Relationships = any> = {
  type: string;
  id?: string | number;
  attributes: Attributes;
  relationships?: Relationships;
};

export type LinksObject = {
  self: string;
  next: string | null;
  perv: string | null;
};

export type MetaObject = {
  totalItems?: number;
  itemCount?: number;
  totalPages?: number;
  currentPage?: number;
  perPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  [key: string]: any;
};
export interface ResponsePayload {
  status?: string;
  message: string;
  data?: ResourceObject | ResourceObject[];
  meta?: MetaObject;
  links?: LinksObject;
}

export function response(payload: ResponsePayload): unknown {
  return { __formatted: true, ...payload };
}
