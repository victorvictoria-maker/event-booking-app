import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [LoginFormComponent, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {}
