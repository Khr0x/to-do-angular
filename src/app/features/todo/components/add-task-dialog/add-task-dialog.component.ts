import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '@shared/components/task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [TaskFormDialogComponent],
  template: `
    <app-task-form-dialog
      mode="add"
      (saved)="onSaved()"
      (cancelled)="onCancelled()">
    </app-task-form-dialog>
  `
})
export class AddTaskDialogComponent {
  private dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);

  onSaved(): void {
    this.dialogRef.close(true);
  }

  onCancelled(): void {
    this.dialogRef.close(false);
  }
}
