import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import {
    FormControl,
    FormGroupDirective,
    NgForm,
    Validators,
    FormsModule,
    ReactiveFormsModule,
    AbstractControl,
    ValidationErrors,
    ValidatorFn,
    FormGroup,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';
import { NgIf } from '@angular/common';
import LocalStorageManager from '../../util/localStorageManager';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user';

export class EmailErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, PasswordStrengthMeterComponent, NgIf],
    templateUrl: './register.component.html',
    styleUrl: '../../styles/register.component.scss',
})

export class RegisterComponent {
    @ViewChild('password')
    passwordStrength: number | null = null;

    constructor(private router: Router ) {

    }

    passwordsMatch(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if(this.signUpForm && this.signUpForm.value.password !== undefined)
            {
                if(control.value === '' || this.signUpForm.value.password === '')
                {
                    return null;
                } else if(control.value !== this.signUpForm.value.password) {
                    return {matchPassword: {value: control.value}};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
    }

    passwordHasEnoughStrength(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if(this.signUpForm && this.signUpForm.value.password !== undefined)
            {
                if(control.value === '' || this.signUpForm.value.password === '')
                {
                    return null;
                } else if(this.passwordStrength === null) {
                    return {passwordHasEnoughStrength: {value: control.value}};
                } else if(this.passwordStrength < 3) {
                    return {passwordHasEnoughStrength: {value: control.value}};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
    }

    onSubmit(): void {
        if(this.signUpForm.value.username && this.signUpForm.value.email && this.signUpForm.value.password && this.signUpForm.value.confirmPassword && this.signUpForm.errors === null) {
            let userList: UserInterface[] = LocalStorageManager.getItemObject('userList');
            if(userList === null) {
                userList = [];
            }

            console.log('attempt');

            if(this.signUpForm.value.username !== null && this.signUpForm.value.email !== null && this.signUpForm.value.password !== null && this.signUpForm.value.confirmPassword !== null)
            {
              const user: UserInterface = {
                  id: LocalStorageManager.loadLastId('userList') + 1,
                  username: this.signUpForm.value.username,
                  email: this.signUpForm.value.email,
                  password: this.signUpForm.value.password
              };

              userList.push(user);
              LocalStorageManager.setItemObject('userList', userList);
              this.router.navigate(['/login']);
            }
        }
    }

    usernameExists(): ValidatorFn  {
        return (control: AbstractControl): ValidationErrors | null => {
            const username = control.value;
            if(username !== undefined) {
                const userList = LocalStorageManager.getItemObject('userList');

                if(userList === null) {
                    return null;
                }

                const user: UserInterface = userList.find((user: UserInterface) => user.username === username);
                if(user !== undefined) {
                    return {usernameExists: {value: username}};
                } else {
                    return null;
                }
            }

            return null;
        };
    }

    get form() {
      return this.signUpForm.controls;
    }

    get obtainPassword(): string {

        if(this.signUpForm.value.password) {
            return this.signUpForm.value.password;
        }

        return '';
    }

    emailExists(): ValidatorFn  {
        return (control: AbstractControl): ValidationErrors | null => {
            let email = control.value;
            if(email !== undefined) {
                const userList = LocalStorageManager.getItemObject('userList');

                if(userList === null) {
                    return null;
                }

                const user: UserInterface = userList.find((user: UserInterface) => user.email === email);
                if(user !== undefined) {
                    return {emailExists: {value: email}};
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
    }

    public onPasswordStrengthChange(score: number | null) {
      //console.log(score);
      this.passwordStrength = score;
    }

    ngOnChanges(changes: SimpleChanges): void {
    }


    signUpForm = new FormGroup({
        username: new FormControl('', [Validators.required, this.usernameExists()]),
        email: new FormControl('', [Validators.required, Validators.email, this.emailExists()]),
        password: new FormControl('', [Validators.required, this.passwordHasEnoughStrength()]),
        confirmPassword: new FormControl('', [Validators.required, this.passwordsMatch()]),
        safePassword: new FormControl(false)
    });
    }
