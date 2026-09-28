import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

interface TasksResponse {
    id: string,
    nomeDaTarefa: string,
    descricao: string,
    dataCriacao: string,
    dataEvento: string,
    emailUsuario: string,
    dataAlteracao: string,
    statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

export interface TasksPayload {
    id?: string,
    nomeDaTarefa: string,
    descricao: string,
    dataEvento: string,
}

@Injectable(
    {
        providedIn: 'root'
    }
)
export class TasksService {

    private apiUrl = 'http://localhost:8083'; //TODO: colocar em um .env
    private _tasks = signal<TasksResponse[] | null>(null);
    readonly tasks = this._tasks.asReadonly();
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { this.loadTasks() }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ authorization: `${token}` })
    }

    loadTasks(): void {
        this.http.get<TasksResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() })
            .subscribe({
                next: tasks => this._tasks.set(tasks),
                error: () => this._tasks.set([])
            })
    }

    createTask(body: TasksPayload): Observable<TasksResponse> {
        return this.http.post<TasksResponse>(`${this.apiUrl}/tarefas`, body, { headers: this.getHeaders() })
            .pipe(
                tap(() => this.loadTasks())
            );
    }

    editTask(id: string | undefined, body: TasksPayload): Observable<TasksResponse> {
        return this.http.put<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, body, { headers: this.getHeaders() })
            .pipe(
                tap(() => this.loadTasks())
            );
    }

    deleteTask(id: string): Observable<TasksResponse> {
        return this.http.delete<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, { headers: this.getHeaders() })
            .pipe(
                tap(() => this.loadTasks())
            );
    }
}
