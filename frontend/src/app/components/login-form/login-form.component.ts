import { CommonModule } from '@angular/common';
import { Component, signal, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {
  ngOnInit(): void {
    const token = localStorage.getItem('event-booking-app-token');
    const isAdmin = localStorage.getItem('event-booking-is-admin') === 'true';

    const currentUrl = this.router.url;

    if (token) {
      if (isAdmin && currentUrl === '/admin/login') {
        this.router.navigateByUrl('/admin/dashboard');
      } else if (!isAdmin && currentUrl === '/login') {
        this.router.navigateByUrl('/events');
      }
    }
  }

  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);

  @Input() isAdmin: boolean = false;
  @Input() title: string = 'Welcome Back';

  private returnUrl: string | null = null;

  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || null;
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { usernameOrEmail, password } = this.loginForm.value;

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (result) => {
        this.loginForm.reset();
        this.isLoading.set(false);
        console.log('Login successful:', result.message);

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          const isAdmin = result.isAdmin;
          this.router.navigateByUrl(isAdmin ? 'admin/dashboard' : 'events');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Login failed:', error.message);
      },
    });
  }
}
