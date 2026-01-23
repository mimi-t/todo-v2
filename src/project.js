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

const projectInterface = (() => {
    function createProject(name, toDos) {
        const newProject = new Project(name, toDos);
        const allProjects = util.getFromLocalStorage(PROJECTS)
        allProjects.push(newProject);
        util.setToLocalStorage(PROJECTS, allProjects);
        return newProject;
    }

    function getProjectIndex(id) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        return allProjects.findIndex(proj => proj.id === id);
    }

    function updateProjectName(id, newName) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        const projectToUpdate = allProjects[this.getProjectIndex(id)]
        projectToUpdate.name = newName;
        allProjects[this.getProjectIndex(id)] = projectToUpdate;
        util.setToLocalStorage(PROJECTS, allProjects);
    }

    function addToDoToProject(id, newToDo) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        const projectToUpdate = allProjects[this.getProjectIndex(id)]
        projectToUpdate.toDos.push(newToDo);
        allProjects[this.getProjectIndex(id)] = projectToUpdate;
        util.setToLocalStorage(PROJECTS, allProjects);
    }

    function deleteProject(id) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        allProjects.splice(this.getProjectIndex(id), 1);
        util.setToLocalStorage(PROJECTS, allProjects);
    }
    return { createProject, updateProjectName, addToDoToProject, deleteProject };
})();


export { projectInterface };