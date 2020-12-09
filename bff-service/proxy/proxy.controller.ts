import {
  All,
  Controller,
  Req,
  HttpStatus,
  Get,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './services/proxy.service';

@Controller()
export class ProxyController {
  // eslint-disable-next-line no-unused-vars
  constructor (private cartService: ProxyService) {}

  @Get('product')
  @UseInterceptors(CacheInterceptor)
  fetchProducts(@Req() request: Request): any {
    return this.cartService.makeRequest(process.env['product'], request);
  }

  @All()
  makeProxy(@Req() request: Request): any {
    const urlArr = request.url.slice(1).split('/');
    const endpoint = process.env[urlArr[0]];

    if (endpoint) {
      const endpointUriArr = urlArr.slice(1);
      const endpointUri = endpointUriArr.length ? `/${endpointUriArr.join('/')}` : '';
      return this.cartService.makeRequest(`${endpoint}${endpointUri}`, request);
    } else {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Cannot process request',
      };
    }
  }
}
