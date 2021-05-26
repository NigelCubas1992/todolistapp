import { timestamp } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { TodoService } from './shared/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers : [TodoComponent]
})
export class TodoComponent implements OnInit {
  toDoListArray: any[];
  toDoListArrayDone: any[];
  constructor(private toDoService: TodoService) { }

  ngOnInit(){
    this.toDoService.getToDoList().snapshotChanges()
    .subscribe(item => {
      this.toDoListArray = [];
      item.forEach(element => {
        var x = element.payload.toJSON();
        x["$key"] = element.key;
        this.toDoListArray.push(x);
      })

      this.toDoListArray.sort((a,b) =>{
        return a.isChecked - b.isChecked;
      })
    });

    this.toDoService.getToDoListDone().snapshotChanges()
    .subscribe(item => {
      this.toDoListArrayDone = [];
      console.log(item)
      item.forEach(element => {
        console.log(x)
        var x = element.payload.toJSON();
        x["$key"] = element.key;
        this.toDoListArrayDone.push(x);
      })
      console.log(this.toDoListArrayDone);
    });
  }
  
  //Añadir Task

  addTask(itemTitle) {
    this.toDoService.addName(itemTitle.value);
    itemTitle.value = null;
    for (let i of this.toDoListArray) {
      console.log (this.toDoListArray[i]);
    }
  }

  //Añadir la tarea al historico o borrarla una vez escogida la taask
  toCheck($key: string,isChecked,item) {
    this.toDoService.toCheckName($key,isChecked+1);
    if(isChecked == 1){
      this.toDoService.addNameDone(item.title);
      this.removeTask($key);
    }
    item = null;
  }

  //Metodos para ordenar las tasks tanto por nombre, por fecha como por prioridad.

  //Variable para poder rotar y ordenar
  up: boolean;
  order: boolean;

  orderbyName(up: boolean = true){
    this.toDoListArray = this.toDoListArray.sort( (a, b) => {
      if(a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) {
        if (up) {
          return -1;
        } else {
          return 1
        }
      }else if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()){
        if (up) {
          return 1;
        } else {
          return -1
        }
      }
      else return 0
    });
    this.order = true;
    this.up = up;
  }

  orderbyDate(up: boolean = true){
    this.toDoListArray = this.toDoListArray.sort( (a, b) => {
      return a.timestamp - b.timestamp;
    })
  }

  orderbyPriority(){
    this.toDoListArray = this.toDoListArray.sort((a,b) =>{
      return a.isChecked - b.isChecked;
    })
  }
  
  //Métodos que ordenan las tareas que han sido realizadas, por fecha y por nombre

  orderTasksbyDateDone(up: boolean = true){
    this.toDoListArrayDone = this.toDoListArrayDone.sort( (a, b) => {
      return a.timestamp - b.timestamp;
    })
  }

  orderTasksbyNameDone(up: boolean = true){
    this.toDoListArrayDone = this.toDoListArrayDone.sort( (a, b) => {
      if(a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) {
        if (up) {
          return -1;
        } else {
          return 1
        }
      }else if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()){
        if (up) {
          return 1;
        } else {
          return -1
        }
      }
      else return 0
    });
    this.order = true;
    this.up = up;
  }

  //Editar Task
  editTask($key: string,item,itemTitle){
    item.title = itemTitle.value;
    this.toDoService.getItemFirebase($key,item);
    itemTitle.value = null;
  }

  //Métodos para borrar las Tasks
  removeTask($key : string){
    this.toDoService.deleteTask($key);
  }

  removeAllTask(){
    this.toDoService.deleteAllTask();
  }

  removeAllTaskDone(){
    this.toDoService.deleteAllTaskDone();
  }

}
