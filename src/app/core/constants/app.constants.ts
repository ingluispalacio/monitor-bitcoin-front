import { UserRole } from '../enums/user-role.enum';
import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiBaseUrl,
  WS_URL: environment.wsBaseUrl
};

export const APP_CONFIG = {
  APP_NAME: environment.appName,
  PRICE_REFRESH_INTERVAL: environment.priceRefreshInterval,
  TOAST_DURATION: environment.toastDuration
};


export const ROLES = {
  ADMIN: UserRole.ADMIN,
  CLIENT: UserRole.CLIENT
};

export const CRYPTO_SYMBOLS = {
  BITCOIN: 'bitcoin',
  ETHEREUM: 'ethereum',
} as const;


export const FEATURES = {
    ...environment.features,
  PURCHASES: 'purchases'
};

export const JWT_CONFIG = environment.jwt;