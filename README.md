# ToDoAngular

Aplicacion de gestion de tareas desarrollada con Angular 21 que implementa un arquitectura modular con lazy loading, guards de ruta, interceptors HTTP y gestion de estado reactiva mediante signals.

## Inicio

### Instalacion de Dependencias

```bash
npm install
```

### Ejecutar Servidor de Desarrollo

```bash
npm run start
```

La aplicacion estara disponible en: **http://localhost:4200/**

La aplicacion se recargara automaticamente ante cualquier modificacion en los archivos fuente.

## Stack Tecnologico

- **Framework:** Angular 21.2.2
- **UI Library:** Angular Material 21 (Material Design 3)
- **Lenguaje:** TypeScript 5.9
- **Estado:** Angular Signals + RxJS
- **HTTP:** HttpClient con interceptors funcionales
- **Formularios:** ReactiveFormsModule

## Arquitectura del Proyecto

```
src/app/
├── core/                    # Modulo core: servicios singletons, guards, interceptors
│   ├── guards/             # Proteccion de rutas
│   ├── interceptors/       # Interceptores HTTP
│   ├── models/              # Interfaces y modelos TypeScript
│   └── services/           # Servicios singletons
├── features/                # Modulos de funcionalidades (lazy-loaded)
│   ├── auth/               # Modulo de autenticacion
│   │   ├── login/
│   │   ├── register/
│   │   └── register-success/
│   └── todo/               # Modulo de gestion de tareas
│       ├── tasks/
│       ├── completed-tasks/
│       └── components/
│           ├── add-task-dialog/
│           └── edit-task-dialog/
└── shared/                  # Componentes compartidos
    └── components/
        ├── main-layout/
        ├── task-card/
        ├── confirm-dialog/
        └── task-form-dialog/
```

## Componentes Reutilizables

La aplicacion cuenta con un conjunto de componentes compartidos ubicados en `src/app/shared/components/` que son utilizados a traves de la aplicacion:

### MainLayoutComponent

Layout principal que envuelve las rutas protegidas de la aplicacion. Incluye la barra de navegacion superior y el area de contenido. Utiliza el outlet de Angular Router para renderizar las rutas hijos.

### TaskCardComponent

Componente de presentacion para tarjetas de tareas. Muestra el nombre, prioridad con color e icono distintivo, estado de completado y fecha de creacion. Permite alternar el estado de completado mediante un checkbox y emite eventos para edicion y eliminacion.

### ConfirmDialogComponent

Dialogo generico de confirmacion utilizado para acciones destructivas como eliminacion de tareas. Acepta un titulo y mensaje configurable, y retorna la decision del usuario (confirmar/cancelar).

### TaskFormDialogComponent

Dialogo reutilizable para la creacion y edicion de tareas. Contiene un formulario reactivo con validacion para el campo nombre (requerido) y un selector de prioridad (baja, media, alta). Se reutiliza tanto en `AddTaskDialogComponent` como en `EditTaskDialogComponent`.

## Lazy Loading

Todas las rutas de funcionalidades utilizan carga diferida mediante `loadComponent` de Angular 17+. Esto permite que el JavaScript se divida en chunks separados, reduciendo el tamano del bundle inicial y mejorando los tiempos de carga.

Ejemplo de implementacion:

```typescript
{
  path: 'auth/login',
  loadComponent: () => import('./features/auth/login/login.component')
    .then(m => m.LoginComponent)
}
```

## Guards de Ruta

Se implementan dos guards funcionales que protegen las rutas de la aplicacion:

### authGuard

Protege rutas que requieren autenticacion. Redirige automaticamente a `/auth/login` con el parametro `returnUrl` para preservar la ubicacion original cuando el usuario inicia sesion exitosamente.

### publicGuard

Impide que usuarios ya autenticados accedan a rutas publicas como login y registro. Si el usuario tiene una sesion activa, es redirigido automaticamente a la pagina principal `/`.

Ambos guards utilizan `toObservable()` para esperar de forma reactiva a que `authService.isLoading` sea `false` antes de evaluar el estado de autenticacion, evitando condiciones de carrera durante la verificacion inicial.

## Interceptors

### authInterceptor

Interceptor funcional que clona todas las peticiones HTTP y agrega `withCredentials: true` para incluir cookies en las solicitudes cross-origin. Esto es esencial para el flujo de autenticacion basado en cookies/Session.

## Gestion de Estado con Signals

La aplicacion utiliza el API de Signals de Angular para estado reactivo:

```typescript
// Ejemplo en AuthService
#currentUser = signal<User | null>(null);
#isLoading = signal<boolean>(true);

currentUser = computed(() => this.#currentUser());
isAuthenticated = computed(() => this.#currentUser() !== null);
```

Los signals calculados (`computed`) derivan valores automaticamente, mientras que `toObservable()` permite la interoperabilidad con RxJS en contextos donde es necesario.

## Modelos de Datos

### Task

```typescript
interface Task {
  id: string;
  nombre: string;
  prioridad: 'baja' | 'media' | 'alta';
  finalizada: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}
```

## Rutas de la Aplicacion

| Ruta | Componente | Guard |
|------|-------------|-------|
| `/auth/login` | LoginComponent | publicGuard |
| `/auth/register` | RegisterComponent | publicGuard |
| `/auth/register-success` | RegisterSuccessComponent | - |
| `/` | TasksComponent | authGuard |
| `/tasks` | TasksComponent | authGuard |
| `/completed` | CompletedTasksComponent | authGuard |

## Funcionalidades

### Autenticacion

- Formulario de inicio de sesion con validacion reactiva
- Formulario de registro con validacion de contrasena (mayusculas, minusculas, numeros, caracteres especiales)
- Verificacion automatica del estado de autenticacion en la construccion del servicio
- Redireccion automatica segun estado de sesion

### Gestion de Tareas

- Listado de tareas con estadisticas (total, pendientes, completadas)
- Filtrado por prioridad y estado
- Paginacion de resultados
- Tareas agrupadas por prioridad (Alta, Media, Baja)
- Dialogos para agregar y editar tareas
- Confirmacion de eliminacion
- Alternar estado de completado de tarea

### Tareas Completadas

- Vista dedicada de tareas completadas
- Restaurar tarea a estado pendiente
- Eliminacion permanente
- Paginacion

## Configuracion de Entornos

### Desarrollo

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Produccion

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tu-dominio.com'
};
```

## Configuracion HTTP

La aplicacion utiliza `provideHttpClient()` con las siguientes opciones:

- `withFetch()` - Usa fetch API en lugar de XMLHttpRequest
- `withInterceptors()` - Registra interceptors funcionales

## Path Aliases

El proyecto configura path aliases en `tsconfig.json` para importaciones mas limpias:

```json
{
  "paths": {
    "@app/*": ["src/app/*"],
    "@core/*": ["src/app/core/*"],
    "@shared/*": ["src/app/shared/*"],
    "@features/*": ["src/app/features/*"],
    "@environments/*": ["src/environments/*"]
  }
}
```

## Construccion

```bash
npm run build
```
