import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
  HttpCode,
  Param,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @GetUser('id') userId: string, 
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(userId, dto, file);
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({
      page: Number(page) || 1,
      search: search || '',
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: string,
  ) {
    return this.productsService.remove(id, userId);
  }
}
