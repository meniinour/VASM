import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; //✅ Import provideHttpClient
import { MsalService, MSAL_INSTANCE, MsalRedirectComponent, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { routes } from './app.routes';

const msalConfig = {
  auth: {
    clientId: 'your-client-id', // Your client ID from Azure
    authority: 'https://login.microsoftonline.com/your-tenant-id', // Your tenant ID or common
    redirectUri: 'http://localhost:56015', // Your redirect URI
  },
};

export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    MsalService ,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }
  ]
};
