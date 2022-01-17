import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { GqlAuthGuard } from './auth.gql-guard';
import { AuthResolver } from './auth.resolver';

const jwtConfig = config.get('jwt');

@Module({
  providers: [AuthService, JwtStrategy, GqlAuthGuard, AuthResolver],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
