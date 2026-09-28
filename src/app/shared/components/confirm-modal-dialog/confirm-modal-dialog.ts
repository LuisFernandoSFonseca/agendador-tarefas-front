import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';


interface DialogData {
  title: string;
  message: string;
  confirmButton: string;
  cancelButton: string;
}

@Component({
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatIconModule,
    MatTimepickerModule,
    MatDatepickerModule],
  selector: 'app-confirm-modal-dialog',
  styleUrl: './confirm-modal-dialog.scss',
  templateUrl: './confirm-modal-dialog.html',
})
export class ConfirmModalDialog {

  readonly dialogRef = inject(MatDialogRef<ConfirmModalDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onSave() {
    this.dialogRef.close(this.data)
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
