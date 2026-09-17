import { Component, Input, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  selector: 'input-password-field',
  styleUrl: './password-field.scss',
  templateUrl: './password-field.html',
})
export class PasswordField {
  hide = signal(true);

  @Input({required: true}) control!: FormControl;
  @Input() placeholder: string = 'Digite a sua senha';

  get passwordErrors() : string | null {
    const passwordControl = this.control;
    if (passwordControl?.hasError('required')) return 'Senha é um campo obrigatórtio';
    if (passwordControl?.hasError('minlength')) return 'A senha deve conter no mínimo 8 caracteres';
    return null
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
