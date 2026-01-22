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

export { ToDo };