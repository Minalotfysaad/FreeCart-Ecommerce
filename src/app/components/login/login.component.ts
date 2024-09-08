import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  //Injections
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  // Properties
  errorMsg: string = '';
  successMsg: string = '';
  isLoading: boolean = false;
  loginSub!: Subscription;

  // Login Form 
  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });

  // Re-password 
  confirmPass(g: AbstractControl): null | Object {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
  // Submission Function
  loginSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.loginSub = this._AuthService
        .setLoginForm(this.loginForm.value)
        .subscribe({
          next: (response) => {
            this.successMsg = response.message;
            this._ToastrService.success('Logged In', 'FreshCart');
            this.isLoading = false;
            // Save Token
            localStorage.setItem('userToken', response.token);
            // Decode Token
            this._AuthService.saveUserData();
            // Navigate To Home
            this._Router.navigate(['/home']);
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message;
            this._ToastrService.error(this.errorMsg, 'FreshCart');
            this.isLoading = false;
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }
}
