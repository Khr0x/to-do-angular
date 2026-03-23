import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TaskService } from '@core/services/task.service';
import { AddTaskDialogComponent } from '../components/add-task-dialog/add-task-dialog.component';
import { EditTaskDialogComponent } from '../components/edit-task-dialog/edit-task-dialog.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TaskCardComponent } from '@shared/components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    TaskCardComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  public taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  prioridad = signal<string>('');
  finalizada = signal<string>('');

  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  onPageChange(event: PageEvent): void {
    this.applyFilters(String(event.pageIndex + 1), String(event.pageSize));
  }

  applyFilters(page?: string, limit?: string): void {
    const currentPage = page || String(this.taskService.paginationInfo().page);
    const currentLimit = limit || String(this.taskService.paginationInfo().limit);
    
    this.taskService.loadTasks({
      page: currentPage,
      limit: currentLimit,
      prioridad: this.prioridad() || undefined,
      finalizada: this.finalizada() || undefined
    });
  }

  clearFilters(): void {
    this.prioridad.set('');
    this.finalizada.set('');
    this.taskService.loadTasks();
  }

  openAddTaskDialog(): void {
    this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      disableClose: false
    });
  }

  openEditTaskDialog(id: string): void {
    this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { id }
    });
  }

  toggleTask(id: string): void {
    this.taskService.toggleTaskStatus(id);
  }

  deleteTask(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: false,
      data: {
        title: 'Eliminar Tarea',
        message: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.taskService.deleteTask(id);
      }
    });
  }
}
