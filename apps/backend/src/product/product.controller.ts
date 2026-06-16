import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SetResponseMessage } from 'src/common/decorators/set-message.decorator';

@Controller('/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @SetResponseMessage('Products fetched successfully')
  @Get()
  public async findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Public()
  @SetResponseMessage('Products fetched successfully')
  @Get('best-sellers')
  public async findBestSellers() {
    return this.productService.findBestSellers();
  }

  @Public()
  @SetResponseMessage('Products fetched successfully')
  @Get('latest-product')
  public async findLatestProduct() {
    return this.productService.findLatestProduct();
  }

  @Public()
  @SetResponseMessage('Products fetched successfully')
  @Get('category/:categoryId')
  public async findCategoryProducts(@Param('categoryId') categoryId: string) {
    return this.productService.findCategoryProducts(categoryId);
  }

  @Public()
  @SetResponseMessage('Product fetched successfully')
  @Get('slug/:slug')
  public async findOneBySlug(@Param('slug') slug: string) {
    return this.productService.findOneBySlug(slug);
  }

  @Public()
  @SetResponseMessage('Product fetched successfully')
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
