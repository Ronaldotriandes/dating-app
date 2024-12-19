import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { GlobalStoreService } from 'src/setup/global-store.service';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configSerive: ConfigService,
    private globalData: GlobalStoreService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    const access_token = headers.access_token as string;
    // Access headers globally
    if (!access_token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = this.jwtService.verify(access_token, {
        secret: this.configSerive.get('jwt.secret'),
      });
      this.globalData.setterTokenData(decoded);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }
    console.log('User-Agent:', headers['user-agent']);
    next();
  }
}
