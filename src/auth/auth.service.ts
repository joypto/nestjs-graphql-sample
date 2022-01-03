import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.createUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const user = await this.userRepository.findOne({ username: authCredentialDto.username });

        if(user && (await bcrypt.compare(authCredentialDto.password, user.password))) {
            const payload = { username: authCredentialDto.username };
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed');
        }
    }
}
