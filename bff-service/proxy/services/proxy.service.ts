import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { getAcceptedHeaders } from './proxy.service.utils';

@Injectable()
export class ProxyService {
  // eslint-disable-next-line no-unused-vars
  constructor (private httpService: HttpService) {}

  makeRequest(
    url,
    {
      method,
      params,
      headers,
      body: data,
    }): Observable<AxiosResponse<any>> {

    const acceptedHeaders = getAcceptedHeaders(headers);

    const isdataPresented = Object.keys(data).length;
    const isParamsPresented = Object.keys(params).length;
    const isHeadersPresented = Object.keys(acceptedHeaders).length;

    return this.httpService.request({
      url,
      method,
      ...(isParamsPresented ? { params } : {}),
      ...(isdataPresented ? { data } : {}),
      ...(isHeadersPresented ? { headers: acceptedHeaders } : {})
    })
      .pipe(
        map(response => response.data),
        catchError(e => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
}
