import { Reflector } from '@nestjs/core';
import { Role } from 'src/generated/prisma/enums';

const RolesDecorator = Reflector.createDecorator<Role[]>();

export default RolesDecorator;
