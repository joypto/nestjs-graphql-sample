import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
        return this.authService.signUp(authCredentialDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialDto);
    }
}
