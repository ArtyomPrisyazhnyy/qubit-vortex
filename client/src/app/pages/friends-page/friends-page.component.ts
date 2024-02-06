import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendsService } from '../../services/friends.service';
import { API_URL } from '../../../environments/environments';
import { FriendsCriteria } from '../../types/friend.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-friends-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './friends-page.component.html',
    styleUrl: './friends-page.component.scss'
})
export class FriendsPageComponent implements OnInit {
    API_URL = API_URL;
    searchData: FormGroup;

    constructor(
        public friendsService: FriendsService
    ){
        this.searchData = new FormGroup({
            searchFriend: new FormControl<string>('', [
                Validators.maxLength(20)
            ])
        })
    }
    friendsEnum = FriendsCriteria;
    friendsCriteria = Object.values(FriendsCriteria)

    ngOnInit(): void {
        this.friendsService.getFriends().subscribe();
    }

    onSubmit(): void {
        if (this.searchData.valid) {
            this.friendsService.setSearch(this.searchData.value.searchFriend);
            this.friendsService.getFriends().subscribe();
        } else {
            console.error('not valid')
        }
    }

    changeCriteria(criteria: FriendsCriteria): void {
        this.friendsService.updateCriteria(criteria);
        this.friendsService.getFriends().subscribe();
    }

    accept(friendId: number): void {
        this.friendsService.acceptFriendRequest(friendId)
            .subscribe(() => {
                this.friendsService.getFriends().subscribe();
                this.friendsService.getFriendRequestCount().subscribe();
            });
    }

    decline(friendId: number): void{
        this.friendsService.declineFriendRequest(friendId)
            .subscribe(() => {
                this.friendsService.getFriends().subscribe();
                this.friendsService.getFriendRequestCount().subscribe();
            })
    }

    unfriend(friendId: number): void {
        this.friendsService.unfriend(friendId)
            .subscribe(() => {
                this.friendsService.getFriends().subscribe();
            })
    }
}
