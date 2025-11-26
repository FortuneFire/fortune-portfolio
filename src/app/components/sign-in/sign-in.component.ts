import { Component } from '@angular/core';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email = '';
  password = '';

  signIn() {
    console.log('Sign in attempted', { email: this.email, password: this.password });
    // Add your authentication logic here
  }
}
