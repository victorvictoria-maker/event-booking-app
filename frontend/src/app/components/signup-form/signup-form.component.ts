import { Component, inject, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupFormComponent implements OnInit {
  ngOnInit(): void {
    const token = localStorage.getItem('event-booking-app-token');
    const isAdmin = localStorage.getItem('event-booking-is-admin') === 'true';

    if (token) {
      this.router.navigateByUrl(isAdmin ? '/admin/dashboard' : '/dashboard');
    }
  }

  signupForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  @Input() isAdmin: boolean = false;
  @Input() title: string = 'Join Us';

  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );
  }

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!confirm) return null;
    return password === confirm ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { username, email, password, confirmPassword } =
      this.signupForm.value;

    const data = {
      username,
      email,
      password,
      confirmPassword,
      isAdmin: this.isAdmin,
    };

    this.authService.register(data).subscribe({
      next: (result) => {
        this.signupForm.reset();
        this.isLoading.set(false);
        console.log('Signup successful:', result.message);

        if (result.isAdmin === true) {
          this.router.navigateByUrl('admin/dashboard');
        } else {
          this.router.navigateByUrl('dashboard');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Signup failed:', error.message);
      },
    });
  }
}
