/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
}
