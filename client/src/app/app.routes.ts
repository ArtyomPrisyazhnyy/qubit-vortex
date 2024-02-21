import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthorizationPageComponent } from './pages/authorization-page/authorization-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { authGuard } from './guards/auth.guard';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { TagsPageComponent } from './pages/tags-page/tags-page.component';
import { SavesPageComponent } from './pages/saves-page/saves-page.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { QuestionPageComponent } from './pages/question-page/question-page.component';
import { AskQuestionPageComponent } from './pages/ask-question-page/ask-question-page.component';
import { ChatsPageComponent } from './pages/chats-page/chats-page.component';
import { UpdateProfilePageComponent } from './pages/update-profile-page/update-profile-page.component';
import { ChatRoomPageComponent } from './pages/chat-room-page/chat-room-page.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: 'login', 
        component: AuthorizationPageComponent
    },
    {
        path: 'registration', 
        component: AuthorizationPageComponent
    },
    {
        path: 'question/:id', 
        component: QuestionPageComponent
    },
    {
        path: 'updateProfile', 
        component: UpdateProfilePageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'profile', 
        component: ProfilePageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'users', 
        component: UsersPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'tags', 
        component: TagsPageComponent,
    },
    {
        path: 'chats', 
        component: ChatsPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'chats/:id',
        component: ChatRoomPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'saves', 
        component: SavesPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'friends', 
        component: FriendsPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: 'askQuestion', 
        component: AskQuestionPageComponent,
        canActivate: [authGuard()]
    },
    {
        path: '**', 
        redirectTo: 'home', 
        pathMatch: 'full'
    }
];

