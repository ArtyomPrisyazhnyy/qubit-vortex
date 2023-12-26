import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), 
    provideClientHydration(),
    provideHttpClient(withInterceptors([LoggerInterceptor])),
    provideToastr(),
  ]
};
