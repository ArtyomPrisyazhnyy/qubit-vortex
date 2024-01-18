import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { filter } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './Components/Auth/Signup/signup.component';
import { LoginComponent } from './Components/Auth/Login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ModalComponent } from './Components/modal/modal.component';
import { AuthService } from './services/auth.service';
import { DeleteQuestionComponent } from './Components/modal/delete-question/delete-question.component';
import { DeleteAnswerComponent } from './Components/modal/delete-answer/delete-answer.component';
import { HighlightModule } from 'ngx-highlightjs';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
        SignupComponent,
        LoginComponent,
        HomePageComponent,
        ToastrModule,
        DeleteQuestionComponent,
        DeleteAnswerComponent,
        HighlightModule,
        MatSelectCountryModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'client';

    constructor(
        private router: Router,
        private authService: AuthService
    ){}

    isAuthPath: boolean = false;

    ngOnInit(): void {
        if(typeof localStorage !== 'undefined'){
            this.authService.decodeToken(localStorage.getItem("token"))
        }
        
        // Подписка на события изменения маршрута
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
            .subscribe(() => {
                const path = this.router.url;

                this.isAuthPath = (path === '/login' || path === '/registration' || path === '/updateProfile');

                console.log('Текущий путь:', path);
                console.log('isAuth:', this.isAuthPath);
            });
    }
}
