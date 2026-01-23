import { ToDo } from "./todo.js";
import { Project } from "./project.js";
import * as util from "./util.js";
import './styles.css';

class AppController {
    createProject(name, toDos) {
        const newProject = new Project(name, toDos);
        const allProjects = util.getFromLocalStorage(PROJECTS)
        allProjects.push(newProject);
        util.setToLocalStorage(PROJECTS, allProjects);
        return newProject;
    }

    getProjectIndex(id) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        return allProjects.findIndex(proj => proj.id === id);
    }

    updateProjectName(id, newName) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        const projectToUpdate = allProjects[this.getProjectIndex(id)]
        projectToUpdate.name = newName;
        allProjects[this.getProjectIndex(id)] = projectToUpdate;
        util.setToLocalStorage(PROJECTS, allProjects);
    }

    addToDoToProject(id, newToDo) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        const projectToUpdate = allProjects[this.getProjectIndex(id)]
        projectToUpdate.toDos.push(newToDo);
        allProjects[this.getProjectIndex(id)] = projectToUpdate;
        util.setToLocalStorage(PROJECTS, allProjects);
    }

    deleteProject(id) {
        const allProjects = util.getFromLocalStorage(PROJECTS)
        allProjects.splice(this.getProjectIndex(id), 1);
        util.setToLocalStorage(PROJECTS, allProjects);
    }

    createToDo(title, description, dueDate, priority, projectId) {
        let newToDo = new ToDo(title, description, dueDate, priority);
        this.addToDoToProject(projectId, newToDo);
    }

}

class DisplayController {
    // DOM related functions
}

const PROJECTS = "projects";
const CURRENT_PROJECT = "currentProject";
const appController = new AppController();
if (!localStorage.getItem(PROJECTS)) {
    // set up default Project if it is the user's first time using the app
    util.setToLocalStorage(PROJECTS, []);
    const newProject = appController.createProject('New Project', []);
    util.setToLocalStorage(CURRENT_PROJECT, newProject.id);
}