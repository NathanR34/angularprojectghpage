import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { enviroment } from './enviroments/enviroment';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideFirebaseApp(() => initializeApp(enviroment.firebase)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
