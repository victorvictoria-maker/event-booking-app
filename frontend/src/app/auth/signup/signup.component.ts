import { Component } from '@angular/core';
import { SignupFormComponent } from '../../components/signup-form/signup-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [SignupFormComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isLogin = true;
}
