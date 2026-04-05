import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || "secret",
            signOptions: { expiresIn: '1d' },
        }), TypeOrmModule.forFeature([User])
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService, JwtModule]
})

export class UserModule { }