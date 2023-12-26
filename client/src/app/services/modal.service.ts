import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

    openModal() {
        this.isOpenSubject.next(true);
    }

    closeModal() {
        this.isOpenSubject.next(false);
        document.body.classList.remove('modal-open');
    }
}
