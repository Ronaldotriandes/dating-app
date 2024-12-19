import { Body, Controller, Post, Request } from '@nestjs/common';
import * as Joi from 'joi';

import { AuthService } from './auth.service';
import { CREATE, JoiSchema, UPDATE } from 'nestjs-joi';

export class UserValidation {
  @JoiSchema(Joi.string().required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  fullname!: string;

  @JoiSchema(Joi.string().email().required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  email!: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  password!: string;

  @JoiSchema(Joi.string().valid('male', 'female').required())
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
  gender!: string;
}

export class LoginValidation {
  @JoiSchema(Joi.string().email().required())
  email!: string;

  @JoiSchema(Joi.string().required())
  password!: string;
}

interface AuthProps {
  access_token: string;
}
@Controller('api/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  register(@Request() req): Promise<AuthProps> {
    console.log('regis');
    return this.service.register(req.body);
  }

  @Post('/login')
  login(@Body() user: LoginValidation): Promise<AuthProps> {
    console.log(user);
    return this.service.login(user.email, user.password);
  }
}
