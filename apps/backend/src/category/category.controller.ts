import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import RolesDecorator from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';

@Controller('/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RolesDecorator([Role.Admin])
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('include') include: string) {
    return this.categoryService.findAll(include);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('include') include: string) {
    return this.categoryService.findOne(id, include);
  }

  @RolesDecorator([Role.Admin])
  @UseGuards(JwtAuthGuard)
  @Patch(':id/set-inactive')
  setInactive(@Param('id') id: string) {
    return this.categoryService.setInactive(id);
  }

  @RolesDecorator([Role.Admin])
  @UseGuards(JwtAuthGuard)
  @Patch(':id/set-active')
  setActive(@Param('id') id: string) {
    return this.categoryService.setActive(id);
  }

  @RolesDecorator([Role.Admin])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
