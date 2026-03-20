import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Mis Tareas</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Aquí se mostrarán tus tareas pendientes.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class TasksComponent {}
