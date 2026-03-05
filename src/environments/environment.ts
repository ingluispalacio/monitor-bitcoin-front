export const environment = {
  production: false,
  name: 'development',
  
  // API Configuration
  apiBaseUrl: 'http://localhost:7077/api/v1',
  wsBaseUrl: 'ws://localhost:7077/ws',
  
  // Features
  features: {
    purchases: true,
    websocket: true,
    mockData: false
  },
  
  // App Configuration
  appName: 'Crypto Monitor (Dev)',
  priceRefreshInterval: 10000, // 10 segundos
  toastDuration: 3000,
  
  // Security
  jwt: {
    allowedDomains: ['localhost:7077'],
    disallowedRoutes: ['http://localhost:7077/api/v1/auth/login']
  },
  
  // External APIs (si se llaman directamente desde front)
  coinGeckoApiKey: '', // Solo si usas proxy
  
  // Logging
  logLevel: 'debug'
};