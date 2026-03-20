import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { TasksComponent } from './features/todo/tasks/tasks.component';
import { authGuard, publicGuard } from './core';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: TasksComponent, canActivate: [authGuard] },
      { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
      { path: 'completed', component: TasksComponent, canActivate: [authGuard] },
      { path: 'settings', component: TasksComponent, canActivate: [authGuard] }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
