import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  apiUrl: string;
  showcaseEnabled: boolean;
}

export const ENV_TOKEN = new InjectionToken<Environment>('ENVIRONMENT_CONFIG');