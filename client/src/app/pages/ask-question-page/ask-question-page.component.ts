import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../services/questions.service';
import { IPostQuestionRes } from '../../types/question.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ask-question-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './ask-question-page.component.html',
    styleUrl: './ask-question-page.component.scss'
})
export class AskQuestionPageComponent {
    questionData: FormGroup;

    constructor(
        private readonly questionsService: QuestionService,
        private router: Router
    ){
        this.questionData = new FormGroup({
            title: new FormControl<string>('', [
                Validators.required,
                Validators.maxLength(255)
            ]),
            fullDescription: new FormControl<string>('', [
                Validators.required
            ])
        })
    }

    autoResizeTitle(e: any): void {
        const textarea = e.target;
        textarea.style.height = '27px'; 
        textarea.style.height = `${Math.max(27, textarea.scrollHeight)}px`;
    }

    autoResizeDescription(e: any): void {
        const textarea = e.target;
        textarea.style.height = '343px'; 
        textarea.style.height = `${Math.max(343, textarea.scrollHeight)}px`;
    }

    onSubmit() {
        if(this.questionData.valid) {
        this.questionsService.createQuestion(this.questionData.value)
            .subscribe({
                next: (response: IPostQuestionRes) => {
                    const newQuestionId = response.id;
                    this.router.navigate(['/question', newQuestionId]);
                },
                error: error => console.error('error creating question: ', error),
            });
        } else {
            console.error('not valid')
        }
    }

    cancelForm(e: any): void{
        e.preventDefault();
    }

}
