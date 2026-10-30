export interface IResponse<T> {
  code: number;
  status: boolean;
  message?: string;
  data: T;
}
