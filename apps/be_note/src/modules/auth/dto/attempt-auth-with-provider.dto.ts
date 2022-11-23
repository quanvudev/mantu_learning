import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { AuthProvider } from '../entities/auth.entity';

type Auth0Provider = Exclude<AuthProvider, AuthProvider.DEFAULT>;

export class AttemptAuthWithProviderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  redirect_uri: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: AuthProvider.GOOGLE,
  })
  provider: Auth0Provider;
}
