import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { IUSersPage } from '../../types/user.interface';
import { API_URL } from '../../../environments/environments';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {
    constructor(
        public usersService: UsersService,
        public friendsService: FriendsService
    ){}

    loading: boolean = false;
    API_URL = API_URL;

    ngOnInit(): void {
        this.loading = true;
        this.usersService.getAllUsers().subscribe(() => {
            this.loading = false;
        });
    }

    sendRequest(friendId: number){
        this.friendsService.sendFriendRequest(friendId)
            .subscribe({
                next: () => {
                    this.usersService.getAllUsers().subscribe()
                },
                error: error => console.error('error sending request: ', error)
            })
    }
}
