import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { TaskService } from '@core/services/task.service';
import { TaskPriority } from '@core/models/task.model';

export type TaskFormMode = 'add' | 'edit';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.scss'
})
export class TaskFormDialogComponent implements OnInit {
  @Input() mode: TaskFormMode = 'add';
  @Input() taskId?: string;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  taskForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    prioridad: ['media' as TaskPriority, Validators.required],
    finalizada: [false]
  });

  loading = false;

  ngOnInit(): void {
    if (this.mode === 'edit' && this.taskId) {
      this.loadTask();
    }
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.loading = true;
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.loading = false;
        this.taskForm.patchValue({
          nombre: task.nombre,
          prioridad: task.prioridad,
          finalizada: task.finalizada
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cancelled.emit();
      }
    });
  }

  save(): void {
    if (this.taskForm.valid) {
      this.loading = true;

      if (this.mode === 'add') {
        this.taskService.createTask(this.taskForm.value);
        this.loading = false;
        this.saved.emit();
      } else if (this.mode === 'edit' && this.taskId) {
        this.taskService.updateTask(this.taskId, this.taskForm.value);
        this.loading = false;
        this.saved.emit();
      }
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
