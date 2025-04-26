import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withViewTransitions()), provideClientHydration(),
    provideHttpClient(withFetch()) ,provideAnimations(),provideToastr({
      timeOut: 999999,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ]
};


