export type TaskPriority = 'baja' | 'media' | 'alta';

export interface Task {
  id: string;
  nombre: string;
  prioridad: TaskPriority;
  finalizada: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CreateTaskDto {
  nombre: string;
  prioridad: TaskPriority;
  finalizada: boolean;
}

export interface UpdateTaskDto {
  nombre?: string;
  prioridad?: TaskPriority;
  finalizada?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}