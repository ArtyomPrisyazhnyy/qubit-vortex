import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/questions.service';
import { API_URL } from './../../../environments/environments';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../Components/modal/modal.component';
import { DeleteQuestionComponent } from '../../Components/modal/delete-question/delete-question.component';
import { DeleteAnswerComponent } from '../../Components/modal/delete-answer/delete-answer.component';

@Component({
    selector: 'app-question-page',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule, 
        ModalComponent, 
        DeleteQuestionComponent,
        DeleteAnswerComponent
    ],
    templateUrl: './question-page.component.html',
    styleUrl: './question-page.component.scss'
})

export class QuestionPageComponent implements OnInit {
    answerData: FormGroup;

    constructor(
        private route: ActivatedRoute, 
        public questionsService: QuestionService,
        public authService: AuthService,
        public modalService: ModalService
    ){
        this.answerData = new FormGroup({
            answer: new FormControl<string>('', [
            Validators.required
            ])
        })
    }

    loading = false;
    API_URL = API_URL;

    questionId: string = '0'

    ngOnInit(): void {
        this.loading = true;

        this.route.params.subscribe(params => {
            this.questionId = params['id'];
            this.questionsService.getOneQuestion(this.questionId).subscribe(() => {
            this.loading = false
            })
        });
    }

        autoResizeAnswer(e: any): void {
        const textarea = e.target;
        textarea.style.height = '343px'; 
        textarea.style.height = `${Math.max(343, textarea.scrollHeight)}px`;
    }

    onSubmit(){
        if(this.answerData.valid){
            this.questionsService.createAnswer(this.answerData.value, this.questionId)
            .subscribe({
                next: () => {
                    this.questionsService.getOneQuestion(this.questionId).subscribe();
                    this.answerData.reset({answer: ''})
                },
                error: error => console.error('error creating answer for question: ', error)
            })
        } else {
            console.error('not valid')
        }
    }

    openModal(){
        this.modalService.openModal();
        document.body.classList.add('modal-open')
    }
}
