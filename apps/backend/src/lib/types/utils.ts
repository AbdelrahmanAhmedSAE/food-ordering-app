import { Decimal } from '@prisma/client/runtime/client';

export type Numeric<T> = {
  [K in keyof T]: T[K] extends Decimal
    ? number
    : T[K] extends (infer U)[]
      ? Numeric<U>[]
      : T[K] extends object
        ? Numeric<T[K]>
        : T[K];
};
