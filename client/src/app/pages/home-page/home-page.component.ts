import { API_URL } from './../../../environments/environments';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/questions.service';
import { RouterLink } from '@angular/router';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderCriteria } from '../../types/orderCriteria.enum';
import { CustomDatePipe } from '../../pipes/custom-date-pipe.pipe';
import { ReplaceSymbolsPipe } from '../../pipes/replace-symbols.pipe';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        CommonModule, 
        RouterLink,
        InlineCodePipe,
        NgxPaginationModule,
        CustomDatePipe,
        ReplaceSymbolsPipe
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
    currentPage: number = 1;

    orderCriteriaValues = Object.values(OrderCriteria);

    ngOnInit(): void {
        this.currentPage = 1;
        this.loading = true;
        this.getAllQuestions();
    }

    getAllQuestions(): void {
        this.questionsService.getAll(
            this.questionsService.activeLimit, 
            this.questionsService.currentPage.toString(),
            this.questionsService.searchQustion,
            this.questionsService.Criteria
        ).subscribe(() => {
            this.loading = false;
            //console.log(this.questionsService.questions)
        });
    }

    onPageChange(page: number): void {
        this.questionsService.updateCurrentPage(page);
        this.getAllQuestions();
    }

    setActiveLimit(limit: string): void {
        this.loading = true;
        this.questionsService.updateActiveLimit(limit);
        this.onPageChange(1);
        this.getAllQuestions();
    }

    isActive(limit: string): boolean {
        return this.questionsService.activeLimit === limit;
    }

    changeCriteria(criteria: OrderCriteria): void{
        this.questionsService.updateCriteria(criteria);
        this.questionsService.updateCurrentPage(1);
        this.getAllQuestions();
    }
}
