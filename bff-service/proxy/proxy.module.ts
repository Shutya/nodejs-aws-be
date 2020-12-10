import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProxyController } from './proxy.controller';
import { ProxyService } from './services/proxy.service';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 120 }),
    HttpModule
  ],
})
export class ProxyModule { }
