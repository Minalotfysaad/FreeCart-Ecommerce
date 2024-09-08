import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgotpass',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.scss',
})
export class ForgotpassComponent implements OnDestroy {
  //Injections
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  // Properties
  verifyEmailSub!: Subscription;
  verifyCodeSub!: Subscription;
  resetPassSub!: Subscription;
  errorMsg: string = '';
  successMsg: string = '';
  isLoading: boolean = false;
  step: number = 1;

  //Verify Email Form
  verifyEmailForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  //Verify Code Form
  verifyCodeForm: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
  });

  //Reset password Form
  resetPassForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });

  // verifyEmailForm Submission Function
  verifyEmailSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isLoading = true;

    let emailValue = this.verifyEmailForm.get('email')?.value;
    this.resetPassForm.get('email')?.patchValue(emailValue);

    if (this.verifyEmailForm.valid) {
      this.verifyEmailSub = this._AuthService
        .setVerifyEmailForm(this.verifyEmailForm.value)
        .subscribe({
          next: (response) => {
            this.successMsg = response.message;
            this._ToastrService.success(this.successMsg, 'FreshCart');
            this.isLoading = false;
            if (response.statusMsg == 'success') {
              setTimeout(() => {
                this.step = 2;
                this.errorMsg = '';
                this.successMsg = '';
              }, 1000);
            }
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message;
            this._ToastrService.error(this.errorMsg, 'FreshCart');
            this.isLoading = false;
          },
        });
    }
  }
  // verifyCodeForm Submission Function
  verifyCodeSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isLoading = true;
    if (this.verifyCodeForm.valid) {
      this.verifyCodeSub = this._AuthService
        .setVerifyCodeForm(this.verifyCodeForm.value)
        .subscribe({
          next: (response) => {
            this.successMsg = response.status;
            this._ToastrService.success(this.successMsg, 'FreshCart');
            this.isLoading = false;
            if (response.status == 'Success') {
              this.step = 3;
              this.errorMsg = '';
              this.successMsg = '';
            }
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message;
            this._ToastrService.error(this.errorMsg, 'FreshCart');
            this.isLoading = false;
          },
        });
    }
  }
  // resetPassForm Submission Function
  resetPassSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isLoading = true;
    if (this.resetPassForm.valid) {
      this.verifyCodeSub = this._AuthService
        .setResetPassForm(this.resetPassForm.value)
        .subscribe({
          next: (response) => {
            this.successMsg = 'Password Reset Successful.';
            this._ToastrService.success(this.successMsg, 'FreshCart');
            this.isLoading = false;
            localStorage.setItem('userToken', response.token);
            this._AuthService.saveUserData();
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
    this.verifyEmailSub?.unsubscribe();
    this.verifyCodeSub?.unsubscribe();
    this.resetPassSub?.unsubscribe();
  }
}
