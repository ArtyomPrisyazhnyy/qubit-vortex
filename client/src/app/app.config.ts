import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()), 
        provideClientHydration(),
        provideHttpClient(withInterceptors([LoggerInterceptor])),
        provideToastr(),
        provideAnimations(),
        importProvidersFrom(
            MatSelectCountryModule.forRoot('en'),
        )
    ]
};
