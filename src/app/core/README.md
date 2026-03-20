# Core Module

Este módulo contiene la funcionalidad central de la aplicación que es compartida entre todos los features.

## Estructura

```
core/
├── guards/          # Guards de rutas (auth, roles, etc.)
├── interceptors/    # HTTP Interceptors
├── models/          # Interfaces y tipos compartidos
├── services/        # Servicios globales
└── index.ts         # Barrel export
```

## Contenido

### Guards
- **auth.guard.ts**: Protege rutas que requieren autenticación
- **publicGuard**: Redirige usuarios autenticados de páginas públicas

### Interceptors
- **auth.interceptor.ts**: Agrega el token JWT a las peticiones HTTP

### Models
- **auth.model.ts**: Interfaces para autenticación (User, LoginCredentials, etc.)

### Services
- **auth.service.ts**: Manejo de autenticación con Signals

## Uso

```typescript
// Importar desde el barrel
import { AuthService, authGuard } from '@core';

// O importar específicamente
import { AuthService } from '@core/services/auth.service';
```

## Path Aliases

Configurados en `tsconfig.json`:
- `@core/*` → `src/app/core/*`
- `@environments/*` → `src/environments/*`
