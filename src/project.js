import { PROJECTS } from "./constants.js";
import { ToDoInterface } from "./todo.js";
import * as util from './util.js';

class Project {
    name = 'New Project';
    toDos = [];
    constructor(name, toDos) {
        this.id = util.generateId();
        this.name = name;
        this.toDos = toDos;
    }
}

const ProjectInterface = (() => {
    function getProject(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        return allProjects[getProjectIndex(id)];
    }

    function getProjectIndex(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        return allProjects.findIndex(proj => proj.id === id);
    }
    function createProject(name, toDos) {
        const newProject = new Project(name, toDos);
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        allProjects.push(newProject);
        util.setObjToLocalStorage(PROJECTS, allProjects);
        return newProject;
    }

    function updateProjectName(id, newName) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const projectToUpdate = getProject(id);
        projectToUpdate.name = newName;
        allProjects[getProjectIndex(id)] = projectToUpdate;
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function deleteProject(id) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        allProjects.splice(getProjectIndex(id), 1);
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function getToDoInProject(toDoId, projId) {
        const project = getProject(projId);
        return project.toDos.find(todo => todo.id === toDoId);
    }

    function addToDoToProject(toDoData, projId) {
        const newToDo = ToDoInterface.createToDo(toDoData.get("title"), toDoData.get("description"), toDoData.get("dueDate"), toDoData.get("priority"));
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const projectIndex = getProjectIndex(projId);
        allProjects[projectIndex].toDos.push(newToDo);
        util.setObjToLocalStorage(PROJECTS, allProjects);
        return allProjects[projectIndex];
    } 

    function updateToDoInProject(toDoData, projId) {
        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const projectIndex = getProjectIndex(projId);
        const toDoIndex = allProjects[projectIndex].toDos.findIndex(toDo => toDo.id === toDoData.id);
        allProjects[projectIndex].toDos[toDoIndex] = toDoData;
        util.setObjToLocalStorage(PROJECTS, allProjects);
        return allProjects[projectIndex];
    } 
    
    return { getProject, getProjectIndex, createProject, updateProjectName, deleteProject, getToDoInProject, addToDoToProject, updateToDoInProject };
})();


export { ProjectInterface };