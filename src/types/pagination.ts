export interface PaginationData<T> {
  data: T;
  meta: { total: number; limit: number; offset: number };
}
