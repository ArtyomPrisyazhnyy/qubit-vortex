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
    ) { }

    users: IUSersPage[] = []

    getAllUsers(): Observable<IUSersPage[]>{
        return this.http.get<IUSersPage[]>(`${API_URL}/users`, 
        {
            params: new HttpParams({
                fromObject: {limit: 28}
            })
        }).pipe(
            retry(2),
            tap(users => this.users = users)
        )
    }
}