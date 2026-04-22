import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Ryzen 5' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  name: string;

  @ApiProperty({ example: '16GB RAM, SSD 512GB', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoryId: string;
}