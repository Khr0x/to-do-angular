import { Injectable, signal, computed } from '@angular/core';
import { Task, CreateTaskDto, TaskPriority } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = signal<Task[]>([]);

  // Tareas pendientes
  public pendingTasks = computed(() => 
    this.tasks().filter(task => !task.completed)
  );

  // Tareas completadas
  public completedTasks = computed(() => 
    this.tasks().filter(task => task.completed)
  );

  // Tareas por prioridad
  public highPriorityTasks = computed(() => 
    this.pendingTasks().filter(task => task.priority === 'Alta')
  );

  public mediumPriorityTasks = computed(() => 
    this.pendingTasks().filter(task => task.priority === 'Media')
  );

  public lowPriorityTasks = computed(() => 
    this.pendingTasks().filter(task => task.priority === 'Baja')
  );

  // Contadores
  public totalTasks = computed(() => this.tasks().length);
  public pendingCount = computed(() => this.pendingTasks().length);
  public completedCount = computed(() => this.completedTasks().length);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks);
        this.tasks.set(parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks()));
  }

  createTask(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      completed: false,
      createdAt: new Date()
    };

    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveTasks();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(tasks => 
      tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
    this.saveTasks();
  }

  toggleTaskStatus(id: string): void {
    this.tasks.update(tasks => 
      tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          };
        }
        return task;
      })
    );
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
    this.saveTasks();
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'Alta':
        return 'warn';
      case 'Media':
        return 'accent';
      case 'Baja':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case 'Alta':
        return 'priority_high';
      case 'Media':
        return 'drag_handle';
      case 'Baja':
        return 'low_priority';
      default:
        return 'drag_handle';
    }
  }
}
