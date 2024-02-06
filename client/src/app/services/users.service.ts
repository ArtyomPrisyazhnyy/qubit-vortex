import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUSersPage } from "../types/user.interface";
import { Observable, retry, tap } from "rxjs";
import { API_URL } from "../../environments/environments";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private readonly http: HttpClient
    ){}

    users: IUSersPage[] = [];
    searchUser: string = '';

    getAllUsers(): Observable<IUSersPage[]>{
        let params = new HttpParams()
            .set('limit', 10)
        if (this.searchUser) {
            params = params.set('searchUser', this.searchUser)
        }
        return this.http.get<IUSersPage[]>(`${API_URL}/users`, {params})
            .pipe(
                retry(2),
                tap(users => this.users = users)
            )
    }

    getCurrentUser(): Observable<any>{
        return this.http.get<any>(`${API_URL}/users/currentUser`)
    }

    setSearch(nickname: string): void {
        this.searchUser = nickname;
    }
}