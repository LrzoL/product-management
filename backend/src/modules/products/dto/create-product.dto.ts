import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Gamer', description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Ryzen 5 4600H, 16GB RAM', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 4500.00, description: 'Preço em Reais' })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    example: ['uuid-categoria-1'], 
    description: 'IDs das categorias associadas',
    type: [String] 
  })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({ type: 'string', format: 'binary', description: 'Imagem do produto' })
  image: any;
}