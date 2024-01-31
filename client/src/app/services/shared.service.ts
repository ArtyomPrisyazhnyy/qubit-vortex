import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private clearInputSource = new BehaviorSubject<boolean>(false);
    clearInput$ = this.clearInputSource.asObservable();

    constructor() {}

    clearInput() {
        this.clearInputSource.next(true);
    }
}
