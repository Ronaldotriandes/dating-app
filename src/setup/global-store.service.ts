import { Global, Injectable, Module } from '@nestjs/common';

interface Token {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
@Injectable()
export class GlobalStoreService {
  constructor() {}
  private store = new Map<string, any>();

  set(key: string, value: any) {
    this.store.set(key, value);
  }

  get(key: string) {
    return this.store.get(key);
  }
  setterTokenData(value) {
    return this.store.set('token', value);
  }

  getterTokenData(): Token {
    return this.store.get('token');
  }
}

// export function GetToken() {
//   console.log(JSON.parse(GlobalStoreService.get('token')));
//   return GlobalStoreService.get('token');
// }

// export function GetTokenEncode(): Token | null {
//   if (GlobalStoreService.get('token')) {
//     const payload = GlobalStoreService.get('token').split('.')[1];
//     const decoded = Buffer.from(payload, 'base64').toString();
//     return JSON.parse(decoded);
//   }
//   return GlobalStoreService.get('token');
// }

// export function SetToken(token: string) {
//   GlobalStoreService.set('token', token);
// }

// export function SetTokenDecode(token: Token) {
//   GlobalStoreService.set('data_token', token);
// }

// export function GetTokenDecode(): Token | null {
//   return GlobalStoreService.get('data_token');
// }

@Global()
@Module({
  providers: [GlobalStoreService],
  exports: [GlobalStoreService],
})
export class GlobalStoreModule {}
