import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, TaskPriority, PaginatedResponse } from '../models/task.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/v1/todo`;

  private tasks = signal<Task[]>([]);
  
  public paginationInfo = signal<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  public pendingTasks = computed(() =>
    this.tasks().filter(task => !task.finalizada)
  );

  public completedTasks = computed(() =>
    this.tasks().filter(task => task.finalizada)
  );

  public highPriorityTasks = computed(() =>
    this.pendingTasks().filter(task => task.prioridad === 'alta')
  );

  public mediumPriorityTasks = computed(() =>
    this.pendingTasks().filter(task => task.prioridad === 'media')
  );

  public lowPriorityTasks = computed(() =>
    this.pendingTasks().filter(task => task.prioridad === 'baja')
  );

  public totalTasks = computed(() => this.tasks().length);
  public pendingCount = computed(() => this.pendingTasks().length);
  public completedCount = computed(() => this.completedTasks().length);

  constructor() {
    this.loadTasks();
  }

  loadTasks(
    filters?: {
      page?: string;
      limit?: string;
      prioridad?: string;
      finalizada?: string;
  }): void {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page);
    if (filters?.limit) params.append('limit', filters.limit);
    if (filters?.prioridad) params.append('prioridad', filters.prioridad);
    if (filters?.finalizada) params.append('finalizada', filters.finalizada);

    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl}/list?${queryString}` : `${this.apiUrl}/list`;

    this.http.get<PaginatedResponse<Task>>(url).subscribe({
      next: (response) => {
        if (response.meta.total !== undefined) {
          this.paginationInfo.set({
            total: response.meta.total,
            page: response.meta.page,
            limit: response.meta.limit,
            totalPages: response.meta.totalPages
          });
        }
        
        const tasks = response.data || [];
        this.tasks.set(tasks.map((t: Task) => ({
          ...t
        })));
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks.set([]);
      }
    });
  }

  createTask(dto: CreateTaskDto): void {
    this.http.post<Task>(`${this.apiUrl}/create`, dto).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error creating task:');
      }
    });
  }

  updateTask(id: string, updates: UpdateTaskDto): void {
    this.http.patch<Task>(`${this.apiUrl}/update/${id}`, updates).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error updating task:');
      }
    });
  }

  toggleTaskStatus(id: string): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    this.http.patch<Task>(`${this.apiUrl}/update/${id}`, {
      finalizada: !task.finalizada
    }).subscribe({
      next: () => {
         this.loadTasks();
      },
      error: (error) => {
        console.error('Error toggling task status:');
      }
    });
  }

  deleteTask(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/list/${id}`).subscribe({
      next: () => {
         this.loadTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/list/${id}`);
  }

  getPriorityColor(prioridad: TaskPriority): string {
    switch (prioridad) {
      case 'alta':
        return 'warn';
      case 'media':
        return 'accent';
      case 'baja':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getPriorityIcon(prioridad: TaskPriority): string {
    switch (prioridad) {
      case 'alta':
        return 'priority_high';
      case 'media':
        return 'drag_handle';
      case 'baja':
        return 'low_priority';
      default:
        return 'drag_handle';
    }
  }

  formatPriorityLabel(prioridad: TaskPriority): string {
    switch (prioridad) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return prioridad;
    }
  }

}