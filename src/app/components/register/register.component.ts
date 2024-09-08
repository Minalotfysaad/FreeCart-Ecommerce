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
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnDestroy {
  //Injections
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  // Properties
  registerSub!: Subscription;
  errorMsg: string = '';
  successMsg: string = '';
  isLoading: boolean = false;

  // Register Form Validations
  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^.{6,}$/)]],
      rePassword: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: this.confirmPass }
  );

  // Re-password validation
  confirmPass(g: AbstractControl): null | Object {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
  // Submission Function
  registerSubmit(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isLoading = true;
    if (this.registerForm.valid) {
      this.registerSub = this._AuthService
        .setRegisterForm(this.registerForm.value)
        .subscribe({
          next: (response) => {
            this.successMsg = response.message;
            this._ToastrService.success(
              'Account created successfully',
              'FreshCart'
            );
            console.log(this.successMsg);
            this.isLoading = false;
            this._Router.navigate(['/login']);
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
    this.registerSub?.unsubscribe();
  }
}
