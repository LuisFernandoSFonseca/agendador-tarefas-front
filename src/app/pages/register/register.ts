import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, PasswordField, ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  get fullNameErrors(): string | null {
    const fullNameControl = this.form.get('nome')
    if (fullNameControl?.hasError('required')) return 'O nome completo é obrigatório'
    if (fullNameControl?.hasError('minlength')) return 'O nome deve ter 3 letras ou mais'
    return null
  }

  get emailErrors(): string | null{
    const emailControl = this.form.get('email')
    if (emailControl?.hasError('required')) return 'O cadastro do E-mail é obrigatório'
    if (emailControl?.hasError('email')) return 'Este E-mail é inválido'
    return null 
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value;

    this.userService.register(formData).subscribe({
      next: (response) => {
        console.log(`Usuário registrado com sucesso`, response);
      },
      error: (error) => {
        console.error(`Erro ao registrar usuário`, error)
      }
    })
  }
}
