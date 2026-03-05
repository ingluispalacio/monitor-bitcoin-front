# 📊 Front Crypto Monitor

> **Proyecto educativo** para el aprendizaje de Angular, arquitectura de aplicaciones web modernas y patrones de desarrollo enterprise.

*Enero 2025 - Trabajo práctico de estudio*

---

## 📝 Descripción del Proyecto

Front Crypto Monitor es una **aplicación web de monitoreo de criptomonedas** construida con Angular. El Sistema permite a usuarios con diferentes roles (Cliente y Administrador) interactuar con un sistema de trading de criptomonedas de manera segura y eficiente.

Esta es una **aplicación educativa** desarrollada con propósitos de aprendizaje, enfocada en demostrar:
- Patrones arquitectónicos modernos en Angular
- Gestión de autenticación y autorización basada en roles
- Comunicación en tiempo real con WebSockets
- Buenas prácticas de desarrollo Frontend

---

## 🎯 Lógica de Negocio

### Actores del Sistema

#### 👤 **Cliente (CLIENT)**
- Visualiza datos de criptomonedas en tiempo real
- Crea órdenes de compra/venta de criptomonedas
- Monitorea el estado de sus órdenes
- Accede a un dashboard personal con su información

#### 🔐 **Administrador (ADMIN)**
- Visualiza dashboard con estadísticas globales del sistema
- Gestiona órdenes de todos los clientes
- Administra permisos y roles de usuarios
- Control de funcionalidades mediante Feature Toggles
- Monitorea actividad del sistema

### Flujos Principales

```
1. AUTENTICACIÓN
   Usuario → Login → Validación JWT → Token almacenado → Redirección según rol

2. MONITOREO DE PRECIOS
   WebSocket (Tiempo Real) → Actualización de precios de criptomonedas
   ├─ Cliente: Visualiza para crear órdenes
   └─ Admin: Monitorea tendencias

3. CREACIÓN DE ÓRDENES
   Cliente → Formulario → Validación → API Backend → Confirmación
   └─ Estado: PENDIENTE → CONFIRMADA → COMPLETADA/CANCELADA

4. GESTIÓN DE ÓRDENES (Admin)
   Admin → Lista de órdenes → Filtrado/Búsqueda → Actualizar estado
   └─ Auditoría y logs de cambios
```

### Modelos de Datos Principales

- **User**: Información del usuario, rol, autenticación
- **Order**: Órdenes de compra/venta con estado y historial
- **CryptoPrice**: Datos de precios actualizados en tiempo real
- **FeatureToggle**: Control de funcionalidades

---

## 🛠️ Tecnología

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | Angular 19 |
| **Lenguaje** | TypeScript 5.7 |
| **Styling** | TailwindCSS 3.3 + Bootstrap Icons |
| **Reactividad** | RxJS 7.8 |
| **HTTP Client** | @angular/http |
| **Autenticación** | JWT (@auth0/angular-jwt) |
| **Toast/Notificaciones** | ngx-toastr |
| **Animaciones** | Angular Animations |
| **Testing** | Karma + Jasmine |
| **CSS** | PostCSS + Autoprefixer |

### Versiones Críticas

```json
{
  "@angular/core": "19.2.0",
  "typescript": "5.7.2",
  "tailwindcss": "3.3.3",
  "rxjs": "7.8.0",
  "@auth0/angular-jwt": "5.2.0"
}
```

---

## 📦 Dependencias

### Dependencias de Producción

```
@angular/animations@^19.2.19      // Animaciones suaves en UI
@angular/cdk@^19.2.19             // Component Dev Kit (dialogs, tablas)
@angular/core@^19.2.0             // Core de Angular
@angular/forms@^19.2.0            // Formularios reactivos
@angular/platform-browser@^19.2.0 // DOM manipulation
@angular/router@^19.2.0           // Enrutamiento
@auth0/angular-jwt@^5.2.0         // Manejo de JWT para autenticación
bootstrap-icons@^1.13.1           // Iconos
ngx-toastr@^20.0.5                // Notificaciones toast
rxjs@~7.8.0                       // Programación reactiva
tslib@^2.3.0                      // TypeScript helper
zone.js@~0.15.0                   // Angular zone
```

### Dependencias de Desarrollo

```
@angular/cli@^21.2.0              // CLI de Angular
@angular/compiler-cli@^19.2.0     // Compilador
typescript@~5.7.2                 // Lenguaje tipado
tailwindcss@^3.3.3                // Framework CSS
autoprefixer@^10.4.27             // PostCSS plugin
karma@~6.4.0                      // Test runner
jasmine-core@~5.6.0               // Testing framework
```

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── app/
│   ├── core/                    # Servicios, guards, interceptores
│   │   ├── constants/           # Constantes de la app
│   │   ├── enums/               # Enumeraciones (roles, eventos)
│   │   ├── guards/              # AuthGuard, RoleGuard
│   │   ├── interceptors/        # JWT, Error handling
│   │   ├── models/              # Interfaces de datos
│   │   └── services/            # Servicios HTTP y lógica
│   │
│   ├── features/                # Módulos de negocio
│   │   ├── auth/                # Login y autenticación
│   │   ├── admin/               # Dashboard admin, usuarios, órdenes
│   │   └── client/              # Dashboard cliente, órdenes
│   │
│   ├── layout/                  # Componentes contenedores
│   │   ├── admin-layout/
│   │   ├── client-layout/
│   │   └── auth-layout/
│   │
│   ├── shared/                  # Componentes reutilizables
│   │   ├── components/          # DataTable, Modal, Spinner
│   │   └── pipes/               # Pipes personalizados
│   │
│   ├── app.component.ts         # Componente raíz
│   ├── app.config.ts            # Configuración (providers)
│   └── app.routes.ts            # Rutas principales
│
├── environments/                # Configuración por ambiente
├── styles.css                   # Estilos globales
└── main.ts                      # Punto de entrada
```

### Patrones Arquitectónicos

#### 1. **Standalone Components** ✨
Todos los componentes son standalone (Angular 14+), eliminando la necesidad de módulos NgModule:

```typescript
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {}
```

#### 2. **Dependency Injection**
Servicios inyectados en constructores con `providedIn: 'root'`:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
}
```

#### 3. **Reactive Programming (RxJS)**
Observable patterns para manejo asincrónico:

```typescript
public user$ = this.auth.currentUser$;  // Observable
public orders$ = this.order.getOrders(); // Observable
```

#### 4. **Guards de Ruta**
Protección de rutas basada en autenticación y rol:

```typescript
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { expectedRole: 'ADMIN' },
  children: [...]
}
```

#### 5. **Interceptores HTTP**
Middleware para:
- **JwtInterceptor**: Inyecta token en headers
- **ErrorInterceptor**: Manejo centralizado de errores

#### 6. **Estructura de Servicios**

```
authService
  ├── login()          → Autenticación
  ├── logout()         → Cierre sesión
  └── getCurrentUser() → Usuario actual

orderService
  ├── createOrder()    → Crear orden
  ├── getOrders()      → Listar órdenes
  ├── updateOrder()    → Actualizar orden
  └── deleteOrder()    → Eliminar orden

cryptoService
  ├── getPrices()      → Precios actuales
  └── listenToPriceUpdates() → WebSocket real-time

websocketService
  ├── connect()        → Conexión WS
  └── onPriceUpdates() → Listener de actualizaciones
```

### Flujo de Datos

```
User Input
    ↓
Component
    ↓ (dispatch action)
Service (HTTP/WS)
    ↓ (Observable)
Backend API
    ↓ (response)
RxJS Operator (map, catchError)
    ↓
BehaviorSubject
    ↓
Component (subscribe)
    ↓
Template (async pipe)
    ↓
UI Update
```

### Control de Acceso

```
Request HTTP
    ↓
JwtInterceptor
├─→ Agrega token al header
    ↓
Backend valida JWT
    ↓ (token válido)
RoleGuard valida rol
├─→ ¿Tiene permiso para acceder?
├─ Sí → Permite acceso
└─ No → Redirecciona a login
```

---

## 🚀 Características Principales

### ✅ Autenticación y Autorización
- Login con JWT (JSON Web Tokens)
- Role-Based Access Control (RBAC)
- Persistencia de sesión con localStorage
- Logout con limpieza de tokens

### ✅ Actualización en Tiempo Real
- WebSocket para precios de criptomonedas
- Push notifications con ngx-toastr
- Auto-refresh en cambios de datos

### ✅ Gestión de Órdenes
- CRUD completo de órdenes
- Filtrado y búsqueda avanzada
- Estado visual con badges
- Auditoría de cambios (timestamp)

### ✅ Dashboard Dual
- **Cliente**: Resumen personal, gráficos de órdenes
- **Admin**: Estadísticas globales, métricas del sistema

### ✅ Componentes Reutilizables
- DataTable (tabla dinámica)
- Modal de confirmación
- Loading spinner
- Notificaciones toast

---

## 🔧 Instalación y Desarrollo

### Requisitos Previos
```bash
Node.js >= 18.x
npm >= 9.x
```

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm start

# Vista previa: http://localhost:4200
```

### Scripts Disponibles

```bash
npm run start       # Desarrollo (ng serve)
npm run build       # Build producción (ng build)
npm run watch       # Watch mode (recarga en cambios)
npm run test        # Ejecutar pruebas (Karma + Jasmine)
```

---

## 🧪 Testing

La aplicación está configurada para testing con:
- **Karma**: Test runner
- **Jasmine**: Framework de testing
- **Coverage**: Análisis de cobertura

```bash
npm test
```

---

## 🎓 Conceptos de Aprendizaje

Este proyecto es excelente para aprender:

1. **Angular Avanzado**
   - Standalone components
   - Standalone routing
   - Signals (Angular 17+)
   - Reactive Forms

2. **Patrones de Diseño**
   - Singleton (Services)
   - Observer (RxJS)
   - Guard (Route Guards)
   - Interceptor (HTTP)

3. **Seguridad Web**
   - JWT authentication
   - RBAC (Role-Based Access Control)
   - Seguridad en localStorage
   - CORS y HTTPS

4. **UX/UI Moderno**
   - TailwindCSS responsive
   - Bootstrap Icons
   - Toast notifications
   - Loading states

5. **Arquitectura Escalable**
   - Separación de concerns
   - Reusability
   - Lazy loading (potencial)
   - Environment config

---

## 📋 Requisitos Funcionales Soportados

- [x] Autenticación de usuarios
- [x] Control de acceso basado en roles
- [x] Visualización de precios en tiempo real
- [x] Creación y gestión de órdenes
- [x] Dashboard para clientes
- [x] Dashboard para administradores
- [x] Gestión de usuarios (admin)
- [x] Feature toggles
- [x] Notificaciones en tiempo real
- [x] Manejo de errores centralizado

---

## 🐛 Notas de Desarrollo

### Consideraciones Importantes

- **JWT Storage**: Tokens guardados en `localStorage` (considera usar `sessionStorage` o cookies seguras en producción)
- **CORS**: Requiere backend con CORS habilitado
- **WebSocket**: Requiere conexión estable al servidor
- **Interceptores**: Orden de ejecución es importante

### Variables de Entorno

Configuradas en `src/environments/environment.ts`:
```typescript
export const environment = {
  apiBaseUrl: 'http://localhost:8080/api',
  wsUrl: 'ws://localhost:8080/ws'
};
```

---

## 👨‍💻 Stack Técnico Resumido

```
┌─────────────────────────────────────┐
│     Frontend (Este Proyecto)         │
│  Angular 19 + TypeScript + RxJS     │
│  TailwindCSS + Bootstrap Icons      │
└─────────────────────────────────────┘
           ↓ (HTTP + WS)
┌─────────────────────────────────────┐
│       Backend (No incluido)          │
│  Java/Spring Boot (referenciado)    │
│  REST API + WebSocket               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      Database (No incluido)          │
│  Base de datos de criptomonedas     │
└─────────────────────────────────────┘
```

---

## 📚 Referencias y Recursos

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/)

---

## 📄 Licencia

Proyecto con fines educativos. Uso libre para estudiantes.

---

## ✍️ Autor

Trabajo práctico - Desarrollo de Software
*Documento creado: Marzo 2025*

---

**¡Espero que disfrutes aprendiendo Angular con este proyecto! 🚀**
