import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule],
  selector: 'app-user-data',
  styleUrl: './user-data.scss',
  templateUrl: './user-data.html',
})
export class UserData {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService)
  readonly dialog = inject(MatDialog)

  user = this.userService.user;
  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }]
  });

  //TODO: add more validations
  registerAddres() {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        button: {
          icon: 'search',
          callback: (cep: string) => this.findAddresByCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { name: 'rua', label: 'Rua' },
      { name: 'numero', label: 'Nº' },
      { name: 'complemento', label: 'Complemento' },
      { name: 'cidade', label: 'Cidade' },
      { name: 'estado', label: 'Estado' },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço', formConfig },
    })


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveAddres(result, token).subscribe({
          next: () => console.log('Endereço cadastrado com sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao cadastrar endereço', result), //TODO: add toast
        });
      }
    })
  };

  registerPhone() {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', validators: [Validators.required] },
      { name: 'numero', label: 'Número', validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adcionar Telefone', formConfig },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.savePhone(result, token).subscribe({
          next: () => console.log('Telefone cadastrado com sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao cadastrar telefone', result), //TODO: add toast
        });
      }
    })
  }

  editAddres(endereco: { id: number, rua: string, numero: number, complemento: string, cidade: string, estado: string, cep: string }) {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        value: endereco.cep,
        button: {
          icon: 'search',
          callback: (cep: string) => this.findAddresByCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { name: 'rua', label: 'Rua', value: endereco.rua, validators: [Validators.required] },
      { name: 'numero', label: 'Nº', type: 'number', value: endereco.numero, validators: [Validators.required] },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento, validators: [Validators.required] },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade, validators: [Validators.required] },
      { name: 'estado', label: 'Estado', value: endereco.estado, validators: [Validators.required] }
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Endereço', formConfig },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateAddres(endereco.id, result, token).subscribe({
          next: () => console.log('Endereço editado com sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao editar endereço', result), //TODO: add toast
        });
      }
    })
  }

  findAddresByCep(cep: string, dialogRef: MatDialogRef<ModalDialog, any>) {
    this.userService.getAddresByCep(cep).subscribe({
      next: (response) => {
        dialogRef.componentInstance.form.patchValue(
          {
            rua: response.logradouro,
            complemento: response.complemento,
            cidade: response.localidade,
            estado: response.uf
          });
      },
      error: () => console.warn('CEP não encontrado')
    })
  }

  editPhone(telefone: { id: number, ddd: string, numero: string }) {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { name: 'numero', label: 'Número', value: telefone.numero, validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Telefone', formConfig },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updatePhone(telefone.id, result, token).subscribe({
          next: () => console.log('Telefone editado com sucesso', result), //TODO: add toast
          error: () => console.log('Erro ao editar telefone', result), //TODO: add toast
        });
      }
    })
  }

}
