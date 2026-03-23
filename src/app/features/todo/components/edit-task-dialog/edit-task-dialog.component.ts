import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskFormDialogComponent, TaskFormMode } from '@shared/components/task-form-dialog/task-form-dialog.component';

export interface EditTaskDialogData {
  id: string;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [TaskFormDialogComponent],
  template: `
    <app-task-form-dialog
      [mode]="mode"
      [taskId]="taskId"
      (saved)="onSaved()"
      (cancelled)="onCancelled()">
    </app-task-form-dialog>
  `
})
export class EditTaskDialogComponent {
  private dialogRef = inject(MatDialogRef<EditTaskDialogComponent>);
  private data: EditTaskDialogData = inject(MAT_DIALOG_DATA);

  mode: TaskFormMode = 'edit';
  taskId: string = this.data.id;

  onSaved(): void {
    this.dialogRef.close(true);
  }

  onCancelled(): void {
    this.dialogRef.close(false);
  }
}
