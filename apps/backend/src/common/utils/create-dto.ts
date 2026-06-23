import { ZodType } from 'zod';

export const createDto = <T extends ZodType>(schema: T) => {
  class ZodDto {
    static schema = schema;
  }

  return ZodDto as typeof ZodDto & { new (): InstanceType<typeof ZodDto> };
};
