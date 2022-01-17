import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "nestjs-prisma";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super({
            secretOrKey: 'Secret1234',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: { username: string }) {
        const {username} = payload;
        const user = await this.prisma.user.findUnique({
            where: {
                username
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
