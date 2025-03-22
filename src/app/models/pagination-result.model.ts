export type PaginationResult<T> = {
  meta: Meta;
  items: T[];
};

export type Meta = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
