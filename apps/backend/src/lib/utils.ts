import { Decimal } from '@prisma/client/runtime/client';
import { Numeric } from './types/utils';

function isDecimal(value: unknown): value is Decimal {
  return value instanceof Decimal;
}

export function numerify<T>(value: T): Numeric<T> {
  if (isDecimal(value)) return value.toNumber() as Numeric<T>;

  if (Array.isArray(value)) return value.map(numerify) as Numeric<T>;

  if (value !== null && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [key, numerify(value)]),
    ) as Numeric<T>;

  return value as Numeric<T>;
}
