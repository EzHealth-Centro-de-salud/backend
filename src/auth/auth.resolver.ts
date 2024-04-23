import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login-user.input';
import {
  Patient,
  Personnel,
  UserResponse,
} from 'src/user/entities/user.entity';
import {
  ChangePasswordInput,
  RecoveryUserInput,
  ValidateRecoveryUserInput,
} from './dto/recovery-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  //------------------------------------Login------------------------------------
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

  //------------------------------------Recovery Password------------------------------------
  @Mutation(() => Boolean)
  async recoveryPatient(
    @Args('recoveryInput') recoveryInput: RecoveryUserInput,
  ) {
    try {
      return await this.authService.recoveryPatient(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Boolean)
  async recoveryPersonnel(
    @Args('recoveryInput') recoveryInput: RecoveryUserInput,
  ) {
    try {
      return await this.authService.recoveryPersonnel(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async validateRecovery(
    @Args('recoveryInput') recoveryInput: ValidateRecoveryUserInput,
  ) {
    try {
      return await this.authService.validateRecovery(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async changePasswordPatient(
    @Args('recoveryInput') recoveryInput: ChangePasswordInput,
  ) {
    try {
      return await this.authService.changePasswordPatient(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async changePasswordPersonnel(
    @Args('recoveryInput') recoveryInput: ChangePasswordInput,
  ) {
    try {
      return await this.authService.changePasswordPersonnel(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
