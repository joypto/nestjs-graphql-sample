import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialInput } from './input/auth-credential.input';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(authCredentialDto: AuthCredentialInput) {
        return this.createUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialInput) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: authCredentialDto.username,
            }
        });

        if (user && (await bcrypt.compare(authCredentialDto.password, user.password))) {
            const payload = { username: authCredentialDto.username };
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed');
        }
    }

    private async createUser(authCredentialDto: AuthCredentialInput) {
        const username = authCredentialDto.username;
        const salt = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(authCredentialDto.password, salt);
        try {
            const user = this.prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                }
            });

            return user;
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Existing username.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
