import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { authGuard, publicGuard } from './core';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'auth/register-success',
    loadComponent: () => import('./features/auth/register-success/register-success.component').then(m => m.RegisterSuccessComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/todo/tasks/tasks.component').then(m => m.TasksComponent), canActivate: [authGuard] },
      { path: 'tasks', loadComponent: () => import('./features/todo/tasks/tasks.component').then(m => m.TasksComponent), canActivate: [authGuard] },
      { path: 'completed', loadComponent: () => import('./features/todo/completed-tasks/completed-tasks.component').then(m => m.CompletedTasksComponent), canActivate: [authGuard] }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
