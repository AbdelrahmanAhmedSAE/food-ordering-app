import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Role } from 'src/generated/prisma/enums';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles([Role.ADMIN])
  @SetResponseMessage('Category created successfully')
  @Post()
  public create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @SetResponseMessage('Categories fetched successfully')
  @Get()
  public findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @SetResponseMessage('Category fetched successfully')
  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles([Role.ADMIN])
  @SetResponseMessage('Category set inactive successfully')
  @Patch(':id/set-inactive')
  public setInactive(@Param('id') id: string) {
    return this.categoryService.setInactive(id);
  }

  @Roles([Role.ADMIN])
  @SetResponseMessage('Category set active successfully')
  @Patch(':id/set-active')
  public setActive(@Param('id') id: string) {
    return this.categoryService.setActive(id);
  }

  @Roles([Role.ADMIN])
  @SetResponseMessage('Category deleted successfully')
  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
