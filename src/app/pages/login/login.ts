import { Component, ViewEncapsulation, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserLoginPayload, UserService } from '../../services/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth';



@Component({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None
})

export class Login { 

  form : FormGroup<{email: FormControl<string>, senha: FormControl<string>}>;
  isLoading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', {validators: [Validators.required, Validators.email], nonNullable: true}),
      senha: this.formBuilder.control ('', {validators: [Validators.required, Validators.minLength(8)], nonNullable: true})
    });
  }

  ngOnInit(): void {
    if(this.authService.isLoggedin()) {
      this.router.navigate(['/tasks'])
    }
  }

   get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  get emailErrors(): string | null {
    const emailControl = this.form.get('email')
    if (emailControl?.hasError('required')) return 'O E-mail de login é obrigatório'
    if (emailControl?.hasError('email')) return 'Este E-mail é inválido'
    return null
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value as UserLoginPayload;

    this.isLoading.set(true);

    this.userService.login(formData)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(`Erro ao entrar`, error)
        }
      })
  }
}
