import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksPayload, TasksService } from '../../services/tasks.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModalDialog } from '../../shared/components/confirm-modal-dialog/confirm-modal-dialog';

@Component({
  imports: [MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule],
  selector: 'app-tasks',
  styleUrl: './tasks.scss',
  templateUrl: './tasks.html',
})
export class Tasks {

  private tasksService = inject(TasksService);
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);

  tasks = this.tasksService.tasks
  hasTasks = () => (this.tasks() ?? []).length > 0;

  normalizarDataEvento(dataEvento: string) {
    console.log("Data evento Recebida", dataEvento)

    const [data, tempo] = dataEvento.split(' ');
    const [day, month, year] = data.split('-').map(Number)
    const [hour, minute] = tempo.split(':').map(Number)

    const dataFormatada = new Date(year, month - 1, day, hour, minute)
    const tempoFormatado = new Date(year, month - 1, day, hour, minute)

    return { dataFormatada, tempoFormatado }
  }

  normalizarDataEventoExibicao(dataEvento: string) {
    console.log("Data evento Recebida", dataEvento)

    const [data, tempo] = dataEvento.split(' ');
    const [day, month, year] = data.split('-')
    const [hour, minute] = tempo.split(':')

    const dataString = `${day}/${month}/${year}`
    const tempoString = `${hour}:${minute}`

    return { dataString, tempoString }
  }

  registerTask() {

    const formConfig: DialogField[] = [
      { name: 'nomeDaTarefa', label: 'Nome da Tarefa' },
      { name: 'descricao', label: 'Descrição da Tarefa' },
      { name: 'data', label: 'Data da Tarefa', type: 'date' },
      { name: 'tempo', label: 'Horário da Tarefa', type: 'time' },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...restante } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0");

        const year = data.getFullYear();
        const month = formatterDateTime(data.getMonth() + 1);
        const day = formatterDateTime(data.getDate());

        const hour = formatterDateTime(tempo.getHours());
        const minute = formatterDateTime(tempo.getMinutes());
        const seconds = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${day}-${month}-${year} ${hour}:${minute}:${seconds}`;
        const payload = {
          ...restante,
          dataEvento
        }

        this.tasksService.createTask(payload).subscribe({
          next: () => console.log('Tarefa criada com sucesso', payload), //TODO: add toast
          error: () => console.log('Erro ao criar tarefa', payload), //TODO: add toast
        });
      }
    })
  };

  editTask(task: TasksPayload) {

    console.log("data tarefa", task.dataEvento)//25-09-2026 14:57:03

    const { dataFormatada, tempoFormatado } = this.normalizarDataEvento(task.dataEvento)
    console.log("data formatada", dataFormatada)

    const formConfig: DialogField[] = [
      { name: 'nomeDaTarefa', label: 'Nome da Tarefa', value: task.nomeDaTarefa },
      { name: 'descricao', label: 'Descrição da Tarefa', value: task.descricao },
      { name: 'data', label: 'Data da Tarefa', type: 'date', value: dataFormatada },
      { name: 'tempo', label: 'Horário da Tarefa', type: 'time', value: tempoFormatado },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig },
    })


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...restante } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0");

        const year = data.getFullYear();
        const month = formatterDateTime(data.getMonth() + 1);
        const day = formatterDateTime(data.getDate());

        const hour = formatterDateTime(tempo.getHours());
        const minute = formatterDateTime(tempo.getMinutes());
        const seconds = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${day}-${month}-${year} ${hour}:${minute}:${seconds}`;
        const payload = {
          ...restante,
          dataEvento
        }

        this.tasksService.editTask(task.id, payload).subscribe({
          next: () => console.log('Tarefa editada com sucesso', payload), //TODO: add toast
          error: () => console.log('Erro ao editar tarefa', payload), //TODO: add toast
        });
      }
    })
  };

  deleteTask(task: string) {
    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      data: {
        title: 'Deletar Tarefa?',
        message: 'Tem certeza que deseja deletar esta tarefa',
        confirmButton: 'Deletar',
        cancelButton: 'Cancelar'
      },
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.tasksService.deleteTask(task).subscribe({
          next: () => console.log('Tarefa deletada com sucesso'), //TODO: add toast
          error: () => console.log('Erro ao deletar tarefa'), //TODO: add toast
        });
      }
    })
  };
}
