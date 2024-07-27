import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthStrategy } from './passport/BasicStategy';
import { JwtStrategy } from './passport/JwtStrategy';
// import { Role, RoleSchema } from '@/api/identity/roles/entities/role.entity';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // MongooseModule.forFeature([
    //   {
    //     schema: RoleSchema,
    //     name: Role.name,
    //   },
    // ]),
  ],
  controllers: [],
  providers: [JwtStrategy, BasicAuthStrategy],
})
export class AuthorizationModule {}
