import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, tap } from 'rxjs';
import { API_URL } from '../../environments/environments';
import { IFriend } from '../types/friend.interface';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

    constructor(
        private readonly http: HttpClient
    ){}

    friendRequests: IFriend[] = [];
    friends: IFriend[] = [];

    sendFriendRequest(friendId: number): Observable<void>{
        return this.http.post<void>(`${API_URL}/friends/send-request`, {friendId: friendId})
    }

    acceptFriendRequest(friendId: number): Observable<void>{
        return this.http.post<void>(`${API_URL}/friends/accept-request`, {friendId: friendId})
    }

    declineFriendRequest(friendId: number): Observable<void>{
        return this.http.delete<void>(`${API_URL}/friends/accept-request/${friendId}`)
    }

    getFriendRequests(): Observable<IFriend[]>{
        return this.http.get<IFriend[]>(`${API_URL}/friends/requests`)
            .pipe(
                retry(2),
                tap(friendsRequests => this.friendRequests = friendsRequests)
            );
    }

    getFriends(): Observable<IFriend[]>{
        return this.http.get<IFriend[]>(`${API_URL}/friends/list`)
            .pipe(
                retry(2),
                tap(friends => this.friends = friends)
            );
    }

}
