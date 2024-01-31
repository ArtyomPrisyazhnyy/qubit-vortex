import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITag } from '../types/tag.interface';
import { Observable, retry, tap } from 'rxjs';
import { API_URL } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class TagsService {

    constructor(
        private readonly http: HttpClient
    ) { }

    tags: ITag[] = [];

    currentTagPage: number = 1;
    searchTag: string = ''

    getAllTags(
        // page?: string, 
        // searchTag?: string
    ): Observable<ITag[]>{
        return this.http.get<ITag[]>(`${API_URL}/tags`)
            .pipe(
                retry(2),
                tap(tags => this.tags = tags)
            )
    }
}
