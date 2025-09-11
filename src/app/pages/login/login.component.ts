import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import LocalStorageManager from '../../util/localStorageManager';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/store';
import { Observable, Subscription } from 'rxjs';
import { authFeature, AuthState } from '../../store/auth/auth.reducer';
import { login } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: '../../styles/login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  auth: AuthState | null = null;
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.store.select(authFeature.selectAuthState).subscribe((auth) => {
        this.auth = auth;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
      if(this.passwordFormControl.valid && this.emailFormControl.valid) {
          const email: string | null = this.emailFormControl.value, password: string | null = this.passwordFormControl.value;
          let userList: UserInterface[] = LocalStorageManager.getItemObject('userList');
          if(userList === null) {
              this.emailFormControl.setErrors({'emailNotFound': email});
              return;
          }

          const user: UserInterface | undefined = userList.find((user: UserInterface) => user.email === email);
          if(user === undefined) {
              this.emailFormControl.setErrors({'emailNotFound': email});
              return;
          }
          if(user.password !== password) {
              this.passwordFormControl.setErrors({'passwordIncorrect': password});
              return;
          }

          this.store.dispatch(login({user: user, token: "defaultToken"}));
          this.router.navigate(['/home']);
      }
  }

  passwordFormControl = new FormControl('', [Validators.required]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

}
