import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { API_URL } from '../../environments/environments';
import { IFriend } from '../types/friend.interface';
import { FriendsCriteria } from '../types/friend.enum';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

    constructor(
        private readonly http: HttpClient
    ){}

    friendRequests: IFriend[] = [];
    friends: IFriend[] = [];
    friendsCriteria: FriendsCriteria = FriendsCriteria.AllFriends;
    searchFriend: string = '';

    friendRequestsCount: number = 0;

    sendFriendRequest(friendId: number): Observable<void>{
        return this.http.post<void>(`${API_URL}/friends/send-request`, {friendId: friendId})
    }

    acceptFriendRequest(friendId: number){
        return this.http.patch(`${API_URL}/friends/accept-request`, {friendId: friendId})
    }

    declineFriendRequest(friendId: number){
        return this.http.patch(`${API_URL}/friends/decline-request`, {friendId: friendId})
    }

    unfriend(friendId: number){
        return this.http.delete(`${API_URL}/friends/unfriend/${friendId}`)
    }


    getFriends(): Observable<IFriend[]>{
        let params = new HttpParams()
            .set('friendsCriteria', this.friendsCriteria)
        if (this.searchFriend) {
            params = params.set('searchFriend', this.searchFriend)
        }
        return this.http.get<IFriend[]>(`${API_URL}/friends/list`, {params})
            .pipe(
                retry(2),
                tap(friends => this.friends = friends)
            );
    }

    getFriendRequestCount(): Observable<number>{
        return this.http.get<number>(`${API_URL}/friends/requests-count`)
            .pipe(
                retry(2),
                tap(count => this.friendRequestsCount = count)
            )
    }

    updateCriteria(criteria: FriendsCriteria): void {
        this.friendsCriteria = criteria;
    }

    setSearch(nickname: string): void {
        this.searchFriend = nickname;
    }

}
