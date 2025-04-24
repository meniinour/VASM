import { Injectable } from '@angular/core';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../auth-config';
import { Client } from '@microsoft/microsoft-graph-client';

@Injectable({
  providedIn: 'root',
})
export class MicrosoftGraphService {
  private msalInstance = new PublicClientApplication(msalConfig);

  constructor() {
    this.msalInstance.initialize();
  }

  async getAccessToken(): Promise<string | null> {
    const account = this.msalInstance.getAllAccounts()[0];
    if (!account) {
      await this.msalInstance.loginPopup(loginRequest);
    }
    const response = await this.msalInstance.acquireTokenSilent(loginRequest);
    return response.accessToken;
  }

  async getMails() {
    const token = await this.getAccessToken();
    const client = Client.init({
      authProvider: (done) => done(null, token!),
    });

    const messages = await client.api('/me/messages').get();
    return messages.value;
  }
}
