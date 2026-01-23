import { ProjectInterface } from "./project.js";
import * as util from './util.js';

class ToDo {
    completed = false;
    constructor(title, description, dueDate, priority) {
        this.id = util.generateId();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

const ToDoInterface = (() => {
    function createToDo(title, description, dueDate, priority) {
        let newToDo = new ToDo(title, description, dueDate, priority);
        return newToDo;
    }

    function toggleCompleted(toDoItem) {
        toDoItem.completed = !toDoItem.completed;
        return toDoItem;
    }

    return { createToDo, toggleCompleted };
})();

export { ToDoInterface };