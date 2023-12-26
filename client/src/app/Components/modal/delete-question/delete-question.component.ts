import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import { QuestionService } from '../../../services/questions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionPageComponent } from '../../../pages/question-page/question-page.component';

@Component({
  selector: 'app-delete-question',
  standalone: true,
  imports: [CommonModule, QuestionPageComponent],
  templateUrl: './delete-question.component.html',
  styleUrl: './delete-question.component.scss'
})
export class DeleteQuestionComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        public modalService: ModalService,
        private questionsService: QuestionService,

    ){}

    questionId: string = '0'

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.questionId = params['id'];
            this.questionsService.getOneQuestion(this.questionId)
        });
    }

    deleteQuestion(){
        this.questionsService.deleteOneQuestion(this.questionId).subscribe({
            next: () => {
                this.modalService.closeModal()
                this.router.navigate(['/home']);
            },
            error: error => console.error('error deleting question: ', error)
        })
    }
}
