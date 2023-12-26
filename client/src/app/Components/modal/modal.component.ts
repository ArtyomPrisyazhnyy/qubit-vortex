import { ModalService } from './../../services/modal.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
    constructor(
        private modalService: ModalService
    ){}
    @Output() closeModalEvent = new EventEmitter();

    closeModal(): void{
        this.modalService.closeModal()
    }
}
