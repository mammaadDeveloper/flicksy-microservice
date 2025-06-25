/* eslint-disable @typescript-eslint/no-explicit-any */
export type ResourceObject<Attributes = any, Relationships = any> = {
  type: string;
  id?: string | number;
  attributes: Attributes;
  relationships?: Relationships;
  links?: {
    self?: string;
    related?: string;
  };
  meta?: Record<string, any>;
  [key: string]: any;
};

export type LinksObject = {
  self: string;
  next: string | null;
  perv: string | null;
};

export type MetaObject = {
  page?: {
    totalItems?: number;
    itemCount?: number;
    totalPages?: number;
    currentPage?: number;
    perPage?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
    [key: string]: any;
  };
  filters?: Record<
    string,
    string | number | boolean | (string | number | boolean)[]
  >;
  stats?: {
    [key: string]: number | string | boolean | null;
  };
  rate_limit?: {
    limit: number;
    remaining: number;
    reset_at: string; // ISO timestamp
  };

  trace_id?: string;

  timestamp?: string; // ISO timestamp

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
