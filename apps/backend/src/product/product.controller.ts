import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  public async findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get('best-sellers')
  public async findBestSellers() {
    return this.productService.findBestSellers();
  }

  @Get('latest-product')
  public async findLatestProduct() {
    return this.productService.findLatestProduct();
  }

  @Get('category/:categoryId')
  public async findCategoryProducts(@Param('categoryId') categoryId: string) {
    return this.productService.findCategoryProducts(categoryId);
  }

  @Get('slug/:slug')
  public async findOneBySlug(@Param('slug') slug: string) {
    return this.productService.findOneBySlug(slug);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
