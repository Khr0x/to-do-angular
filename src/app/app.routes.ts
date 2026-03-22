import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { RegisterSuccessComponent } from './features/auth/register-success/register-success.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { TasksComponent } from './features/todo/tasks/tasks.component';
import { CompletedTasksComponent } from './features/todo/completed-tasks/completed-tasks.component';
import { authGuard, publicGuard } from './core';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'auth/register-success',
    component: RegisterSuccessComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: TasksComponent, canActivate: [authGuard] },
      { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
      { path: 'completed', component: CompletedTasksComponent, canActivate: [authGuard] }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
