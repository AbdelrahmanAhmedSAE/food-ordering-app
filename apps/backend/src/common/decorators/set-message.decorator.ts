import { Reflector } from '@nestjs/core';

export const SetResponseMessage = Reflector.createDecorator<string>();
