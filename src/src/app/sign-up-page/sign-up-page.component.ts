import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth, User, user } from '@angular/fire/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatIconModule, ReactiveFormsModule ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  email = new FormControl('');
  password = new FormControl('');
  hidePassword: boolean = true;
  constructor(private router: Router){  }
  register(){
    this.router.navigate(["login"]);
  }
}
