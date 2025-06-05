import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // loginForm: FormGroup;
  // isLoading = signal(false);
  // showPassword = signal(false);
  // constructor(private fb: FormBuilder, private authService: AuthService) {
  //   this.loginForm = this.fb.group({
  //     usernameOrEmail: ['', [Validators.required]],
  //     password: ['', [Validators.required]],
  //   });
  // }
  // get f() {
  //   return this.loginForm.controls;
  // }
  // togglePasswordVisibility() {
  //   this.showPassword.set(!this.showPassword());
  // }
  // onSubmit() {
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }
  //   this.isLoading.set(true);
  //   const { usernameOrEmail, password } = this.loginForm.value;
  //   this.authService.login(usernameOrEmail, password);
  //   this.loginForm.reset();
  //   this.isLoading.set(false);
  // }
}
