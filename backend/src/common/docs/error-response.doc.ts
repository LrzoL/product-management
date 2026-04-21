import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDoc {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'O campo e-mail é obrigatório' })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}