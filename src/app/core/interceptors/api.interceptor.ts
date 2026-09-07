import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV_TOKEN } from '../tokens/environment.token';

export const apiInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {

    const env = inject(ENV_TOKEN);
    // 1. URL ejemplo: /users
    const isAbsoluteUrl = req.url.startsWith('http') || req.url.startsWith('assets');
    let apiReq = req.clone({
        url: isAbsoluteUrl ? req.url : `${env.apiUrl}${req.url}`
    });

    // 2. Headers
    let headers = apiReq.headers;
    if (!(req.body instanceof FormData)) {
        headers = headers.set('Content-Type', 'application/json');
    }

    apiReq = apiReq.clone({ headers });

    // Pasa la petición al siguiente eslabón (sin tocar las respuestas)
    return next(apiReq);
};