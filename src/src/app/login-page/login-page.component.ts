import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ MatCardModule, MatButtonModule ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})

export class LoginPageComponent {
  constructor(private router: Router, public playerService: PlayerService){ }
  toLogin(){
    this.playerService.openLoginDialog(null, {signUp: false, redirect:true, offerSettings: true});
  }
  toSignup(){
    this.playerService.openLoginDialog(null, {signUp: true, redirect:true, offerSettings: true});
  }
  toGame(){
    this.router.navigate(['game']);
  }
}
