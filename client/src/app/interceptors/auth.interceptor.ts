import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { API_URL } from "../../environments/environments";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        const token = localStorage.getItem('token');
        console.log("tokennnn " + token)
        if(token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }

        return next.handle(req)
    }
}