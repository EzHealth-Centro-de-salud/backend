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
  async loginPatient(@Args('input') loginInput: LoginInput) {
    try {
      console.log('-> loginPatient');
      return await this.authService.loginPatient(loginInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => Personnel)
  async loginPersonnel(@Args('input') loginInput: LoginInput) {
    try {
      console.log('-> loginPersonnel');
      return await this.authService.loginPersonnel(loginInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //------------------------------------Recovery Password------------------------------------
  @Mutation(() => UserResponse)
  async recoveryPatient(@Args('input') recoveryInput: RecoveryUserInput) {
    try {
      console.log('-> recoveryPatient');
      return await this.authService.recoveryPatient(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async recoveryPersonnel(@Args('input') recoveryInput: RecoveryUserInput) {
    try {
      console.log('-> recoveryPersonnel');
      return await this.authService.recoveryPersonnel(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async validateRecovery(
    @Args('input') recoveryInput: ValidateRecoveryUserInput,
  ) {
    try {
      console.log('-> validateRecovery');
      return await this.authService.validateRecovery(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async changePasswordPatient(
    @Args('input') recoveryInput: ChangePasswordInput,
  ) {
    try {
      console.log('-> changePasswordPatient');
      return await this.authService.changePasswordPatient(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => UserResponse)
  async changePasswordPersonnel(
    @Args('input') recoveryInput: ChangePasswordInput,
  ) {
    try {
      console.log('-> changePasswordPersonnel');
      return await this.authService.changePasswordPersonnel(recoveryInput);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
