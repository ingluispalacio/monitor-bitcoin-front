# 📊 Front Crypto Monitor

> **Proyecto educativo** para el aprendizaje de Angular, arquitectura de aplicaciones web modernas y patrones de desarrollo enterprise.

*Enero 2025 - Trabajo práctico de estudio*

---

## 📝 Descripción del Proyecto

Front Crypto Monitor es una **aplicación web de monitoreo de criptomonedas** construida con Angular. El sistema permite a usuarios con diferentes roles (Cliente y Administrador) interactuar con un sistema de trading de criptomonedas de manera segura y eficiente.

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

---

## 🛠️ Tecnología

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | Angular 19 |
| **Lenguaje** | TypeScript 5.7 |
| **Styling** | TailwindCSS 3.3 + Bootstrap Icons |
| **Reactividad** | RxJS 7.8 |
| **Autenticación** | JWT (@auth0/angular-jwt) |
| **Toast/Notificaciones** | ngx-toastr |

---

## 🏗️ Arquitectura

- Uso de **Standalone Components**
- Implementación de **Lazy Loading con `loadComponent`**
- Separación por dominio (**auth, client, admin**)
- Eliminación de NgModules innecesarios

---

### 📁 Estructura de Carpetas (ACTUALIZADA)

```
src/
├── app/
│   ├── core/
│   │   ├── enums/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   │
│   ├── auth/
│   │   └── feature/
│   │       └── login/
│   │
│   ├── client/
│   │   └── feature/
│   │       ├── dashboard/
│   │       ├── create-order/
│   │       └── my-orders/
│   │
│   ├── admin/
│   │   └── feature/
│   │       ├── dashboard/
│   │       ├── orders/
│   │       ├── users/
│   │       └── feature-toggle/
│   │
│   ├── layout/
│   │   ├── auth-layout/
│   │   ├── client-layout/
│   │   └── admin-layout/
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── environments/
└── main.ts
```

---

### ⚡ Lazy Loading (Nuevo enfoque)

```typescript
{
  path: 'dashboard',
  loadComponent: () =>
    import('./client/feature/dashboard/dashboard.page')
      .then(m => m.ClientDashboardPage)
}
```

---

### 🧩 Standalone Components

```typescript
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {}
```

---

### 🛡️ Guards de Ruta

```typescript
{
  path: 'client',
  canActivate: [AuthGuard, RoleGuard],
  data: { expectedRole: 'CLIENT' }
}
```

---

## 🚀 Características Principales

### ✅ Autenticación y Autorización
- Login con JWT
- Control de acceso basado en roles

### ✅ Tiempo Real
- WebSocket para precios
- Notificaciones con Toastr

### ✅ Gestión de Órdenes
- CRUD de órdenes
- Filtros dinámicos
- Estados en tiempo real

### ✅ Arquitectura Moderna
- Standalone Components
- Lazy Loading
- Feature-based structure

---

## 🔧 Instalación y Desarrollo

### Requisitos

```
Node.js >= 18
npm >= 9
```

### Instalación

```
npm install
npm start
```

---

## 🎓 Conceptos de Aprendizaje

- Standalone Components (Angular moderno)
- Lazy Loading con `loadComponent`
- Arquitectura por features
- Guards y control de acceso
- WebSockets en frontend
- Manejo de estado con RxJS

---

## 📋 Requisitos Funcionales

- [x] Autenticación
- [x] Control por roles
- [x] Dashboard cliente/admin
- [x] Órdenes de compra
- [x] Tiempo real (WebSocket)
- [x] Feature toggles

---

## 🐛 Notas de Desarrollo

- Usar `loadComponent` en rutas (no imports directos)
- Evitar NgModules innecesarios
- Mantener separación por dominio

---

## 📄 Licencia

Proyecto con fines educativos.

---

## ✍️ Autor

Trabajo práctico - Desarrollo de Software  
*Marzo 2025*

---

**¡Espero que disfrutes aprendiendo Angular con este proyecto! 🚀**
