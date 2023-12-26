import { HttpInterceptorFn } from "@angular/common/http";

export const LoggerInterceptor: HttpInterceptorFn = (req, next) => {
    if(typeof localStorage !== 'undefined'){
        const token = localStorage.getItem('token');

        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })

        return next(authReq);
    } else {
        return next(req)
    }
}