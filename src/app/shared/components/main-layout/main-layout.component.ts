import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isSidenavOpen = signal(true);

  navItems = [
    { label: 'Mis Tareas', icon: 'check_circle', route: '/tasks' },
    { label: 'Completadas', icon: 'task_alt', route: '/completed' },
    { label: 'Configuración', icon: 'settings', route: '/settings' }
  ];

  toggleSidenav(): void {
    this.isSidenavOpen.update(v => !v);
  }

  logout(): void {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  }
}
