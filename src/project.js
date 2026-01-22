import { generateId } from './util.js';

class Project {
    name = 'New Project';
    toDos = [];
    constructor(name, toDos) {
        this.id = generateId();
        this.name = name;
        this.toDos = toDos
    }

    static from(json) {
        return Object.assign(new Project(), );
    }
}

export { Project };