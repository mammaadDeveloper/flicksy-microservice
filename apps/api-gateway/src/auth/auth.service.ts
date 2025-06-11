import { Observable } from 'rxjs';

import { ClientGrpc } from '@nestjs/microservices';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

interface UsersService {
  VerifyToken(data: { token: string }): Observable<{ userId: number }>;
}
@Injectable()
export class AuthService implements OnModuleInit {
  private usersService: UsersService;
  constructor(
    @Inject('USERS_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UserService');
  }

  async verifyToken(token): Promise<any> {
    try {
      const { userId } = await this.usersService
        .VerifyToken({ token })
        .toPromise();
      return userId;
    } catch (err) {
      console.log(err);
      
      throw err;
    }
  }
}
