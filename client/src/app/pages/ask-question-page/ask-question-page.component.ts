import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../services/questions.service';
import { IPostQuestionRes } from '../../types/question.interface';
import { Router } from '@angular/router';
import { ITag } from '../../types/tag.interface';
import { TagsService } from '../../services/tags.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-ask-question-page',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './ask-question-page.component.html',
    styleUrl: './ask-question-page.component.scss'
})
export class AskQuestionPageComponent {
    questionData: FormGroup;
    searchTagControl: FormControl = new FormControl('');
    showTagList: boolean = false;
    foundTags: ITag = {count: 1, rows: []};

    selectedTags: ITag = {count: 1, rows: []};

    constructor(
        private questionsService: QuestionService,
        private tagService: TagsService,
        private router: Router,
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
        this.searchTagControl.valueChanges
            .pipe(
                debounceTime(800),
                distinctUntilChanged()
            )
            .subscribe((searchValue) => {
                this.searchTags(searchValue);
              });
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
            const tagIds = this.selectedTags.rows.map(tag => tag.id);
            if(tagIds.length > 5){
                console.error('More than 5 tags sent')
            }
            const questionDataWithTags = {
                ...this.questionData.value,
                tagIds
            }
            this.questionsService.createQuestion(questionDataWithTags)
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

    searchTags(searchValue: string): void {
        if (searchValue.trim()) {
            this.showTagList = true;
            this.tagService.getAllTags(searchValue).subscribe((tag) => {
                this.foundTags = tag;
            });
        } else {
            this.showTagList = false;
        }
    }
    
    removeTag(tagId: number): void {
        const index = this.selectedTags.rows.findIndex(tag => tag.id === tagId);
        if (index !== -1) {
            this.selectedTags.rows.splice(index, 1);
        }
    }

    addTag(tagId: number): void {
        const tagExist = this.selectedTags.rows.some(tag => tag.id === tagId);
        if (!tagExist) {
            const tagToAdd = this.foundTags.rows.find(tag => tag.id === tagId);
            if (tagToAdd) {
                this.selectedTags.rows.push(tagToAdd);
                this.clearInput('myInput');
                this.showTagList = false;
            }
        }
    }

    clearInput(id: string): void {
        const inputElement = document.getElementById(id) as HTMLInputElement;
        if (inputElement) {
            inputElement.value = ''; 
            this.searchTagControl.setValue('');
        }
    }

    activateInput(): void {
        const inputElement = document.getElementById('myInput') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    }
    

    cancelForm(e: any): void{
        e.preventDefault();
    }

}
