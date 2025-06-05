import { Component } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-signup',
  imports: [SignupFormComponent, RouterLink],
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.css',
})
export class AdminSignupComponent {}
