import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery 
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Ajuste o caminho se necessário

@ApiTags('Categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Cria uma nova categoria', 
    description: 'Cria uma categoria vinculada ao usuário para organizar produtos.' 
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou erro de validação.' })
  @ApiResponse({ status: 401, description: 'Token JWT ausente ou inválido.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário proprietário da categoria' })
  create(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lista todas as categorias', 
    description: 'Retorna todas as categorias pertencentes ao usuário informado.' 
  })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário para filtrar as categorias' })
  findAll(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Busca uma categoria específica', 
    description: 'Retorna os detalhes de uma categoria através do seu ID.' 
  })
  @ApiResponse({ status: 200, description: 'Categoria encontrada.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário proprietário' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.categoriesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualiza uma categoria', 
    description: 'Altera os dados de uma categoria existente.' 
  })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada para este usuário.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário proprietário' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remove uma categoria', 
    description: 'Exclui permanentemente uma categoria do sistema.' 
  })
  @ApiResponse({ status: 204, description: 'Categoria removida com sucesso (sem conteúdo).' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário proprietário' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.categoriesService.remove(id, userId);
  }
}