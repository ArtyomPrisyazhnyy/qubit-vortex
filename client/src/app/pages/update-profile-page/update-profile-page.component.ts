import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectCountryModule,  Country} from '@angular-material-extensions/select-country';
import { UsersService } from '../../services/users.service';


@Component({
    selector: 'app-update-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSelectCountryModule
    ],
    templateUrl: './update-profile-page.component.html',
    styleUrl: '../authorization-page/authorization-page.component.scss'
})
export class UpdateProfilePageComponent implements OnInit {
    userData: FormGroup;
    loading: boolean = false;
    countryNotFound: boolean = false;

    constructor(
        private profileService: ProfileService,
        private formBuilder: FormBuilder,
        private readonly userService: UsersService
    ){
        this.userData = this.formBuilder.group({
            nickname: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20)
            ]],
            country: [''],
            aboutMe: ['', [
                Validators.maxLength(4000)
            ]],
            links: ['', [
                Validators.maxLength(1000)
            ]]
        })
    }

    ngOnInit(): void {
        this.loading = true;
        this.userService.getCurrentUser().subscribe(data => {
            this.userData.get('nickname')?.setValue(data.nickname);
            this.userData.get('aboutMe')?.setValue(data.aboutMe);
            this.userData.get('links')?.setValue(data.links);
            console.log(data)
            this.loading = false;
        })
    }
    
    
    onCountrySelected($event: Country) {
        console.log($event);
        this.userData.get('')?.setValue($event.name);
        console.log(this.userData)
    }

    onSubmit(){
        const transformedValue = {
            ...this.userData.value,
            country: this.userData.value.country.name
        };
        console.log(transformedValue)
        this.profileService.updateProfile(transformedValue)
    }
}
