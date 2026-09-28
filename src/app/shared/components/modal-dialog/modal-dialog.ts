import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { provideNativeDateAdapter } from '@angular/material/core';

export interface DialogField {
  name: string;
  label: string;
  value?: string | number | Date;
  button?: { icon: string, callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void };
  type?: 'text' | 'number' | 'date' | 'time' | 'timedate';
  validators?: any[];
}

interface DialogData {
  title: string;
  formConfig: DialogField[];
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
  selector: 'app-modal-dialog',
  styleUrl: './modal-dialog.scss',
  templateUrl: './modal-dialog.html',
  providers: [provideNativeDateAdapter()],
})
export class ModalDialog {
  readonly formBuilder = inject(FormBuilder)
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  fields: DialogField[] = this.data.formConfig;

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {}
    this.fields.forEach(field =>
      controls[field.name] = [field.value ?? '', field.validators || []])
    return controls;
  }

  form: FormGroup = this.formBuilder.group(this.buildControls())

  onSave() {
    this.dialogRef.close(this.form.value)
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
