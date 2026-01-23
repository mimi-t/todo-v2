import { generateId } from './util.js';

class ToDo {
    completed = false;
    constructor(title, description, dueDate, priority) {
        this.id = generateId();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}

const toDoInterface = (() => {
    function createToDo(title, description, dueDate, priority, projectId) {
        let newToDo = new ToDo(title, description, dueDate, priority);
        projectInterface.addToDoToProject(projectId, newToDo);
    }
    return { createToDo };
})();

export { toDoInterface };