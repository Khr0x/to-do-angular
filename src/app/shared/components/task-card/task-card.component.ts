import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '@core/models/task.model';

export type TaskCardType = 'pending' | 'completed';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() type: TaskCardType = 'pending';

  @Output() toggle = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() restore = new EventEmitter<string>();

  onToggle(): void {
    this.toggle.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  onRestore(): void {
    this.restore.emit(this.task.id);
  }

  getPriorityClass(): string {
    return this.task.prioridad;
  }

  getPriorityLabel(): string {
    const labels: Record<string, string> = {
      alta: 'Alta',
      media: 'Media',
      baja: 'Baja'
    };
    return labels[this.task.prioridad] || this.task.prioridad;
  }

  getPriorityIcon(): string {
    const icons: Record<string, string> = {
      alta: 'priority_high',
      media: 'drag_handle',
      baja: 'low_priority'
    };
    return icons[this.task.prioridad] || 'flag';
  }
}
