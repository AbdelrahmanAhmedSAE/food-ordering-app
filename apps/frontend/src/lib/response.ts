/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
}
