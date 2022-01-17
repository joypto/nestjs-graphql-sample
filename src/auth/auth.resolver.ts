import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from './auth.model';
import { AuthService } from './auth.service';
import { AuthCredentialInput } from './input/auth-credential.input';
import { User } from './user.model';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => User)
    signUp(
        @Args('data') authDto: AuthCredentialInput
    ) {
        return this.authService.signUp(authDto);
    }

    @Mutation(() => Auth)
    signIn(
        @Args('data') authDto: AuthCredentialInput
    ) {
        return this.authService.signIn(authDto);
    }
}
