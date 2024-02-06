import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { QuestionService } from '../../services/questions.service';
import { SharedService } from '../../services/shared.service';
import { FriendsService } from '../../services/friends.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent implements OnInit {

    constructor(
        private router: Router,
        private questionService: QuestionService,
        private sharedService: SharedService,
        public readonly authService: AuthService,
        public friendsService: FriendsService
    ){}

    ngOnInit(): void {
        if(this.authService.isAuthSig()){
            this.friendsService.getFriendRequestCount().subscribe();
        }
    }

    reset(){
        this.questionService.setSearchQuestion('');
        this.sharedService.clearInput();
        this.questionService.updateCurrentPage(1);

        const path = this.router.url;
        if(path === '/home'){
            this.questionService.getAll().subscribe()
        }
    }
}
