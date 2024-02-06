import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';
import { FriendsService } from '../../../services/friends.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
    selector: 'app-unfriend',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './unfriend.component.html',
    styleUrl: '../modal.component.scss'
})
export class UnfriendComponent {
    @Input() userId: number = 0;
    constructor(
        public modalService: ModalService,
        private friendsService: FriendsService,
        private usersService: UsersService,
        private router: Router,
    ){}

    unfriend(){
        this.friendsService.unfriend(this.userId).subscribe({
            next: () => {
                this.modalService.closeModal();
                const path = this.router.url;
                if (path === '/users'){
                    this.usersService.getAllUsers().subscribe();
                } else if(path === '/friend'){
                    this.friendsService.getFriends().subscribe();
                }
            },
            error: error => console.error("error deleting user from friends: ", error)
        })
    }
}
