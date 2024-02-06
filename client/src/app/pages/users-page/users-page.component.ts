import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { IUSersPage } from '../../types/user.interface';
import { API_URL } from '../../../environments/environments';
import { FriendsService } from '../../services/friends.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ModalComponent } from '../../Components/modal/modal.component';
import { UnfriendComponent } from '../../Components/modal/unfriend/unfriend.component';

@Component({
    selector: 'app-users-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModalComponent,
        UnfriendComponent
    ],
    templateUrl: './users-page.component.html',
    styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {
    searchData: FormGroup;

    constructor(
        public usersService: UsersService,
        public friendsService: FriendsService,
        public modalService: ModalService
    ){
        this.searchData = new FormGroup({
            searchUser: new FormControl<string>('', [
                Validators.maxLength(20)
            ])
        })
    }

    loading: boolean = false;
    API_URL = API_URL;

    ngOnInit(): void {
        this.loading = true;
        this.usersService.getAllUsers().subscribe(() => {
            this.loading = false;
        });
    }

    onSubmit(): void {
        if (this.searchData.valid) {
            this.usersService.setSearch(this.searchData.value.searchUser);
            this.usersService.getAllUsers().subscribe();
        } else {
            console.error('not valid')
        }
    }

    addFriend(friendId: number){
        this.friendsService.sendFriendRequest(friendId)
            .subscribe({
                next: () => {
                    this.usersService.getAllUsers().subscribe()
                },
                error: error => console.error('error sending request: ', error)
            })
    }
    accept(friendId: number){
        this.friendsService.acceptFriendRequest(friendId).subscribe(
            () => this.usersService.getAllUsers().subscribe()
        )
    }
    openModal(){
        this.modalService.openModal();
        document.body.classList.add('modal-open')
    }
}
