import { API_URL } from './../../../environments/environments';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/questions.service';
import { RouterLink } from '@angular/router';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink,
        InlineCodePipe
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
    constructor(
        public questionsService: QuestionService
    ){}

    loading = false;
    API_URL = API_URL;

    ngOnInit(): void {
        this.loading = true;
        this.questionsService.getAll().subscribe(() => {
            this.loading = false;
        });
    }
}
