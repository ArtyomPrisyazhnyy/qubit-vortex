import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProfile } from '../types/profile.interface';
import { API_URL } from '../../environments/environments';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) { }

    profile: IProfile = {
        id: 0,
        nickname: '',
        country: null,
        aboutMe: null,
        links: null,
        avatar: null
    };

    updateProfile(profileData: IProfile){
        return this.http.put<IProfile>(`${API_URL}/users`, profileData)
            .pipe(
                tap(profile => this.profile = profile)
            )
            .subscribe(() => {
                this.router.navigate(['/home'])
            })
    }
}
