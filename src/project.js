import * as util from './util.js';

const PROJECTS = "projects";
class Project {
    name = 'New Project';
    toDos = [];
    constructor(name, toDos) {
        this.id = util.generateId();
        this.name = name;
        this.toDos = toDos
    }

    static from(json) {
        return Object.assign(new Project(), );
    }
}

const projectInterface = (() => {
    function getProject(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        return allProjects[getProjectIndex(id)]
    }

    function getProjectIndex(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        return allProjects.findIndex(proj => proj.id === id);
    }
    function createProject(name, toDos) {
        const newProject = new Project(name, toDos);
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        allProjects.push(newProject);
        util.setObjToLocalStorage(PROJECTS, allProjects);
        return newProject;
    }

    function updateProjectName(id, newName) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        const projectToUpdate = getProject(id);
        projectToUpdate.name = newName;
        allProjects[getProjectIndex(id)] = projectToUpdate;
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function addToDoToProject(id, newToDo) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        const projectToUpdate = getProject(id);
        projectToUpdate.toDos.push(newToDo);
        allProjects[getProjectIndex(id)] = projectToUpdate;
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function deleteProject(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS)
        allProjects.splice(getProjectIndex(id), 1);
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }
    return { createProject, updateProjectName, addToDoToProject, deleteProject };
})();


export { projectInterface };