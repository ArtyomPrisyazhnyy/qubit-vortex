import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr'
import { IAuthLoginUser, IAuthRegistrationUser, IToken, IUserFromToken} from '../types/user.interface';
import { API_URL } from '../../environments/environments';
import {catchError, tap} from 'rxjs';
import { jwtDecode }  from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isAuthSig = signal<boolean>(false);
    currentUser: IUserFromToken | null = null;

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
        private readonly toastr: ToastrService
    ){
        if (typeof localStorage !== 'undefined') {
            const token: string | null = localStorage.getItem('token');
            this.isAuthSig.set(!!token);
        } else {
            // Обработка ситуации, когда localStorage недоступен
            console.error('localStorage is not available.');
        }
    }

    getUserAvatar(){
        if(this.isAuthSig()){
            this.decodeToken(localStorage.getItem('token'));
            console.log(this.currentUser)
        }
    }

    getUserId(): number | null {
        if(this.isAuthSig()){
            this.decodeToken(localStorage.getItem('token'));
            if(this.currentUser){
                return this.currentUser.id
            }
        }
        return null
    }

    decodeToken(token: string | null): any {
        try {
            if(token){
                this.currentUser = jwtDecode(token)
            }
             // Декодируем токен и получаем объект с данными пользователя
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
      }

    
    signUp(userData: IAuthRegistrationUser) {
        return this.http.post<IToken>(`${API_URL}/auth/registration`, userData)
            .pipe(
                tap((res: IToken) => {
                    localStorage.setItem('token', res.token);
                    this.decodeToken(res.token);
                    this.isAuthSig.set(true)
                }),
                catchError(err => {
                    this.handeError(err)
                    throw new Error(err.message)
                })
            )
            .subscribe(
                () => {
                    this.toastr.success('created')
                    this.router.navigate(['/home'])
                }
            )
    }

    login(userData: IAuthLoginUser) {
        return this.http.post<IToken>(`${API_URL}/auth/login`, userData)
            .pipe(
                tap((res: IToken) => {
                    localStorage.setItem('token', res.token);
                    this.decodeToken(res.token);
                    this.isAuthSig.set(true)
                }),

                catchError(err => {
                    this.handeError(err)
                    throw new Error(err.message)
                })
            )
            .subscribe(
                () => {
                    this.toastr.success('Logged in')
                    this.router.navigate(['/home'])
                }
            )
    }

    logout() {
        localStorage.removeItem('token');
        this.isAuthSig.set(false);
        this.currentUser = null
        this.router.navigate(['/login'])
        this.toastr.success('logged out')
    }

    private handeError(err: HttpErrorResponse): void {
        this.toastr.error(err.error.message)
    }
}