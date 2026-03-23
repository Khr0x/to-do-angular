import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '@core/services/task.service';
import { TaskCardComponent } from '@shared/components/task-card/task-card.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-completed-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    TaskCardComponent
  ],
  templateUrl: './completed-tasks.component.html',
  styleUrl: './completed-tasks.component.scss'
})
export class CompletedTasksComponent {
  public taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  pageSize = signal<number>(5);
  pageIndex = signal<number>(0);
  pageSizeOptions = [5, 10, 25, 50];

  paginatedTasks = computed(() => {
    const tasks = this.taskService.completedTasks();
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return tasks.slice(startIndex, endIndex);
  });

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  restoreTask(id: string): void {
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
