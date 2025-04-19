import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { TaskService } from '../services/task/task.service';
import { Task } from '../services/task/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class HomePage {
  
  newTask = '';
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((data: Task[]) => {
      console.log('Tarefas recebidas:', data);
      this.tasks = data;
    });
  }

  addTask() {
    if (this.newTask.trim()) {
      this.taskService.addTask(this.newTask).subscribe(() => {
        this.newTask = '';
        this.loadTasks();
      });
    }
  }
  

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}
