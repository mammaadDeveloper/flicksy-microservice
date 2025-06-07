import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-access') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
