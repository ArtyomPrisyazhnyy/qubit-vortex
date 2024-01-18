import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginComponent } from '../../Components/Auth/Login/login.component';
import { SignupComponent } from '../../Components/Auth/Signup/signup.component';

@Component({
    selector: 'app-authorization-page',
    standalone: true,
    imports: [
        CommonModule,  
        RouterLink,
        LoginComponent,
        SignupComponent
    ],
    templateUrl: './authorization-page.component.html',
    styleUrl: './authorization-page.component.scss'
})
export class AuthorizationPageComponent implements OnInit {

    constructor(
        private route: ActivatedRoute
    ){}

    isLogin: boolean = false;
    isPasswordVisible: boolean = false;
    isConfirmPasswordVisible: boolean = false;

    ngOnInit(): void {
        this.route.url.subscribe(urlSegments => {
        const path = urlSegments.map(segment => segment.path).join('/');

        this.isLogin = path === 'login'
        });
    }
}
