import { Routes } from '@angular/router';
import { GamePageComponent } from './game-page/game-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';

export const routes: Routes = [
    { path: "game", component:  GamePageComponent },
    { path: "login", component: LoginPageComponent },
    { path: "", redirectTo: "login", pathMatch: "full" }
];
