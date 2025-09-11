import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { createFeature, provideState, provideStore } from '@ngrx/store';
import { authFeature} from './store/auth/auth.reducer';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),
    provideStore(), provideState(authFeature), provideZxvbnServiceForPSM()
  ]
};
