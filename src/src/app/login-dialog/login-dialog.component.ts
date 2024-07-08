import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MatCardModule } from '@angular/material/card';
import { Player } from '../player';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PlayerService } from '../player.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';


function confirmValidator(): ValidatorFn {
  return ( (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get("password");
    if(password){
      return ( password.value !== control.value ) ? {unconfirmedPassword: true} : null;
    }
    return null;
  } );
}

function getValues(control: FormGroup, values: {[key:string]:any}){
  if(control.status !== "VALID"){
    return null;
  }
  let results: {[key:string]:string} = {};
  for(let key in values){
    let required = values[key];
    let value = (control.controls[key] && control.controls[key].value) || null;
    if(required && !value){
      return null;
    } else {
      results[key] = value?String(value):"";
    }
  }
  return results;
}

export interface DialogData {
  player: Player | null;
  signUp?: boolean;
  redirect?: boolean;
  offerSettings?: boolean;
}

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, confirmValidator()])
  });
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  inSignUp: boolean = false;
  loadMessage?: string;
  message?: string;
  failed?: boolean;
  player: Player;
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public playerService: PlayerService,
    public router: Router
  ){
    this.inSignUp = !!data.signUp;
    this.player = data.player || new Player();
    let confirmPassword = this.signUpForm.controls.confirmPassword;
    let password = this.signUpForm.controls.password;
    password.valueChanges.subscribe(()=>{
      confirmPassword.reset();
    });
  }
  toLogin(){
    this.inSignUp = false;
  }
  toSignUp(){
    this.inSignUp = true;
  }
  toMessage(message:string, fail:boolean){
    this.message = message;
    this.failed = fail;
  }
  async login(){
    let form = getValues(this.loginForm, {email: true, password: true});
    if(form){
      let existing = this.playerService.getPlayerByAccount({email: form['email']})
      if(existing){
        this.player = existing;
        this.toMessage("Already signed in", false);
        return;
      }
      try {

        this.loadMessage = "Logging in";
        let status = await this.playerService.signIn(this.player, {email: form['email'], password: form['password']});

        if(status.success){

          this.loadMessage = "Loading data";
          await this.playerService.loadUserData(this.player);

          this.playerService.add(this.player);
          
          this.toMessage("Welcome back", false);

        } else {
          this.toMessage(`${status.code} ${status.message}`, true);
        }
      } finally {
        this.loadMessage = undefined;
      }
    }
  }
  async register(){
    let form = getValues(this.signUpForm, {email: true, password: true});
    if(form){
      let existing = this.playerService.getPlayerByAccount({email: form['email']})
      if(existing){
        this.player = existing;
        this.toMessage("Already signed in", false);
        return;
      }
      try {

        this.loadMessage = "Signing up";
        let status = await this.playerService.signUp(this.player, {email: form['email'], password: form['password']});
        
        if(status.success){

          this.playerService.add(this.player);

          this.toMessage("Welcome", false);

        } else {
          this.toMessage(`${status.code} ${status.message}`, true);
        }
      } finally {
        this.loadMessage = undefined;
      }
    }
  }
  async signInWithGoogle(){
    try {
      this.loadMessage = "Signing in";
      let result = await this.playerService.signInWithGoogle(this.player);
      if(result.success){
        if(result.duplicate){

          this.player = result.duplicate;
          this.toMessage("Already signed in", false);

        } else {

          this.loadMessage = "Loading data";
          await this.playerService.loadUserData(this.player);

          this.playerService.add(this.player);

          this.toMessage("Welcome", false);

        }
      } else {
        this.toMessage(`${result.code} ${result.message}`, true);
      }
    } finally {
      this.loadMessage = undefined;
    }

  }
  async signInAnonymous(){
    try {
      this.message = "Signing in"
      let result = await this.playerService.signInAnonymous(this.player);
      if(result.success){
        this.loadMessage = "Loading data";
          await this.playerService.loadUserData(this.player);

          this.playerService.add(this.player);

          this.toMessage("Welcome", false);
      } else {
        this.toMessage(`${result.code} ${result.message}`, true);
      }
    } finally {
      this.loadMessage = undefined;
    }
  }
  clearMessage(){
    this.message = undefined;
    this.failed = undefined;
  }
  close(){
    this.dialogRef.close();
  }
  navigate(){
    if(this.data.redirect){
      this.router.navigate(["/game"]);
    }
  };
  openSettings(){
    if(this.data.offerSettings){
      this.playerService.openSettingsDialog(this.player);
    }
  }
}
