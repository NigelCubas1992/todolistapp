import { SUPER_EXPR } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as firebase from 'firebase/app';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { timestamp } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  toDoList: AngularFireList<any>;
  toDoListDone: AngularFireList<any>;
  itemToUpdate: AngularFireDatabase;
  constructor(private firebasedb: AngularFireDatabase) { 
  }

  getToDoList(){
    this.toDoList = this.firebasedb.list('titles');
    return this.toDoList;
  }

  getItemFirebase(itemKey,item){
    const itemUpdate = this.firebasedb.list('titles');
    itemUpdate.update(itemKey,{title:item.title});
  }

  addName(title: string){
    const aux = new Date();
    const timestamp = aux.getTime();
    this.toDoList.push({
      title: title,
      isChecked: 0,
      timestamp,
    });
  }

  addNameDone(title: string){
    const aux = new Date();
    const timestamp = aux.getTime();
    this.toDoListDone.push({
      title: title,
      timestamp,
    });
  }

  toCheckName($key: string, flag: Number){ 
    this.toDoList.update($key, { isChecked: flag });
  }

  deleteTask($key: string){
    this.toDoList.remove($key);
  }

  deleteAllTask(){
    this.toDoList.remove();
  }

  deleteAllTaskDone(){
    this.toDoListDone.remove();
  }

  getToDoListDone(){
    this.toDoListDone = this.firebasedb.list('titlesDone');
    return this.toDoListDone;
  }

}