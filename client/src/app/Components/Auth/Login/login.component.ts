import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: '../../../pages/authorization-page/authorization-page.component.scss'
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  userData: FormGroup;

  constructor(
    private readonly authService: AuthService
  ) {
    this.userData = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required, 
        Validators.email
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
    });
  }

  onSubmit() {
    if(this.userData.valid) {
      this.authService.login(this.userData.value)
    } else {
      console.log('not valid')
    }
  }
}
