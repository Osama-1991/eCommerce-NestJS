export interface IQuery {
  page?: number;
  limit?: number;
  sort?: string;
  select?: string;
}

export interface IPagination<T> {
  page: number;
  totalCount: number;
  totalPages: number;
  data: T[];
}
