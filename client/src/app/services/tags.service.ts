import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITag } from '../types/tag.interface';
import { Observable, retry, tap } from 'rxjs';
import { API_URL } from '../../environments/environments';
import { TagsCriteria } from '../types/TagsCriteria.enum';

@Injectable({
    providedIn: 'root'
})
export class TagsService {

    constructor(
        private readonly http: HttpClient
    ) { }

    tags: ITag = {count: 0, rows: [] }

    currentTagPage: number = 1;
    searchTag: string = '';
    tagsCriteria: TagsCriteria = TagsCriteria.Popular

    getAllTags(searchTag?: string): Observable<ITag>{
        let params = new HttpParams()
            .set('limit', 10)
            .set('page', this.currentTagPage)
            .set('tagsCriteria', this.tagsCriteria)

        if (!!searchTag) {
            params = params.set('searchTag', searchTag)
        } else {
            params = params.set('searchTag', this.searchTag);
        }
        return this.http.get<ITag>(`${API_URL}/tags`, {params})
            .pipe(
                retry(2),
                tap(tags => this.tags = tags)
            )
    }

    updateCriteria(criteria: TagsCriteria): void {
        this.tagsCriteria = criteria;
    }

    updateCurrentPage(page: number): void {
        this.currentTagPage = page;
    }

    setSearch(tag: string): void{
        this.searchTag = tag;
    }
}
