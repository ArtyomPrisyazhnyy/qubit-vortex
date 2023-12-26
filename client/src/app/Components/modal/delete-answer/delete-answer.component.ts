import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import { QuestionService } from '../../../services/questions.service';

@Component({
  selector: 'app-delete-answer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-answer.component.html',
  styleUrl: './delete-answer.component.scss'
})
export class DeleteAnswerComponent {
    @Input() answerId: string = '';
    @Input() questionId: string = '';

    constructor( 
        public modalService: ModalService,
        private questionsService: QuestionService,
    ){}
    
    deleteOneAnswer(){
        this.questionsService.deleteOneAnswer(this.answerId).subscribe({
            next: () => {
                this.modalService.closeModal();
                this.questionsService.getOneQuestion(this.questionId).subscribe()
            },
            error: error => console.error("error deleting answer: ", error)
        })
    }
}
