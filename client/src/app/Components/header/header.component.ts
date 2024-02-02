import { SharedService } from './../../services/shared.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../services/questions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit  {
    @ViewChild('searchInput') searchInput!: ElementRef;
    searchData: FormGroup;

    constructor(
        public authService: AuthService,
        private questionService: QuestionService,
        private readonly router: Router,
        private sharedService: SharedService
    ){
        this.searchData = new FormGroup({
            searchQuestion: new FormControl<string>('', [
                Validators.maxLength(255)
            ])
        })
    }

    ngOnInit(): void {
        this.sharedService.clearInput$.subscribe(clear => {
            if (clear && this.searchData) { // Проверяем, что FormControl существует
                this.searchData.reset(); // Сбрасываем значения FormControl
                if (this.searchInput) {
                    this.searchInput.nativeElement.value = ''; // Очищаем значение input
                }
            }
        });
    }

    onSubmit(): void{
        if(this.searchData.valid){
            this.questionService.updateCurrentPage(1);
            this.questionService.setSearchQuestion(this.searchData.value.searchQuestion)

            const path = this.router.url;
            if(path !== '/home'){
                this.router.navigate(['/home'])
            }
           
            this.questionService.getAll().subscribe();
        } else {
            console.log('not valid')
        }
    }

    logoutHandler() {
        this.authService.logout()
    }

    activeSearch() {
        this.searchInput.nativeElement.focus();
    }
}
