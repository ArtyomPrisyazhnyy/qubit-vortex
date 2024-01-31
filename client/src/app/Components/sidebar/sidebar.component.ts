import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { QuestionService } from '../../services/questions.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    
    constructor(
        private router: Router,
        private questionService: QuestionService,
        private sharedService: SharedService,
    ){}

    reset(){
        this.questionService.setSerchQuestion('');
        this.sharedService.clearInput();
        this.questionService.updateCurrentPage(1);

        const path = this.router.url;
        if(path === '/home'){
            this.questionService.getAll(
                this.questionService.activeLimit,
                this.questionService.currentPage.toString(),
                this.questionService.searchQustion,
                this.questionService.Criteria
            ).subscribe()
        }
    }
}
