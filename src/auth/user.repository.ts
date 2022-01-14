import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async createUser(authCredentialDto: AuthCredentialDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(authCredentialDto.password, salt);

        const user: User = this.create({ ...authCredentialDto, password: hashedPassword });

        try {
            await this.save(user);
        } catch(error) {
            if(error.code === '23505') {
                throw new ConflictException('Existing username.');
            } else {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }
}
