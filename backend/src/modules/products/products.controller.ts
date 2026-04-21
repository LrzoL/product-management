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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria um novo produto com imagem' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  create(
    @GetUser('id') userId: string,
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(userId, dto, file);
  }

@Get()
@ApiOperation({ summary: 'Lista produtos com busca e paginação' })
findAll(@Query('page') page: string, @Query('search') search: string) {
  // Passando o objeto que o Service agora espera (1 único argumento)
  return this.productsService.findAll({ 
    page: +page || 1, 
    search 
  });
}
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produto existente' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.productsService.remove(id, userId);
  }
}
