import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-user.input';
import { Patient, Personnel } from 'src/user/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Patient)
  async loginPatient(@Args('loginInput') loginInput: LoginInput) {
    try {
      return await this.authService.loginPatient(loginInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Personnel)
  async loginPersonnel(@Args('loginInput') loginInput: LoginInput) {
    try {
      return await this.authService.loginPersonnel(loginInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}