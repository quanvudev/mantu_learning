import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  authId: number;

  @ApiProperty({
    default: 'Anonymous',
  })
  name: string;
}
