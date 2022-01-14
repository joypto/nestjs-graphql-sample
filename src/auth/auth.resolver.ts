import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation()
    signUp(
        @Args('username') username: string,
        @Args('password') password: string,
    ) {
        const authDto : AuthCredentialDto = { username, password };
        return this.authService.signUp(authDto);
    }

    @Mutation()
    signIn(
        @Args('username') username: string,
        @Args('password') password: string,
    ) {
        const authDto : AuthCredentialDto = { username, password };
        return this.authService.signIn(authDto);
    }
}
