import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { IAuthRegistrationUser } from '../../../types/user.interface';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: '../../../pages/authorization-page/authorization-page.component.scss'
})
export class SignupComponent {
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  userData: FormGroup;

  constructor(
    private readonly authService: AuthService
  ) {
    this.userData = new FormGroup({
      nickname: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),
      email: new FormControl<string>('', [
        Validators.required, 
        Validators.email
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])
    });
  }

  onSubmit() {
    if(this.userData.valid) {
      const dataForServer: IAuthRegistrationUser = {
        nickname: this.userData.value.nickname,
        email: this.userData.value.email,
        password: this.userData.value.password,
      }
      if(this.userData.value.password === this.userData.value.password){
        this.authService.signUp(dataForServer)
      } else {
        alert("Сheck the password is correct")
      }
      console.log(this.userData.value);
    } else {
      console.log('not valid')
    }
  }
}
