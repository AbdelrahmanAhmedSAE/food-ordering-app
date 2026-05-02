export default class ApiResponse<T> {
  public data: T;
  public meta: Record<string, any>;

  constructor(data: T, meta: Record<string, any> = {}) {
    this.data = data;
    this.meta = meta;
  }

  public addMeta(key: string, value: any): this {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.meta[key] = value;
    return this;
  }

  public toJSON(): { data: T; meta: Record<string, any> } {
    return {
      data: this.data,
      meta: this.meta,
    };
  }
}
