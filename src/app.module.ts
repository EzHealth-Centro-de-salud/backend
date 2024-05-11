import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './auth/middleware/jwt.strategy';
import { BranchModule } from './branch/branch.module';
import { MedicalRecordModule } from './medical_record/medical_record.module';
import { AppointmentModule } from './appointment/appointment.module';

dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BranchModule,
    MedicalRecordModule,
    AppointmentModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
