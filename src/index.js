import { toDoInterface } from "./todo.js";
import { projectInterface } from "./project.js";
import * as util from "./util.js";
import './styles.css';

class DisplayController {
    // DOM related functions
}
// localStorage.clear();
const PROJECTS = "projects";
const CURRENT_PROJECT = "currentProject";
if (!localStorage.getItem(PROJECTS)) {
    // set up default Project if it is the user's first time using the app
    util.setObjToLocalStorage(PROJECTS, []);
    const newProject = projectInterface.createProject('New Project', []);
    localStorage.setItem(CURRENT_PROJECT, newProject.id);
}

// const projId = localStorage.getItem(CURRENT_PROJECT);
// projectInterface.addToDoToProject(projId, [toDoInterface.createToDo('clean dishes', 'wipe the sink after', new Date(), 'high')])
// projectInterface.updateProjectName(projId, 'asdsadasd');
// projectInterface.createProject('Another one', []);
// projectInterface.deleteProject(localStorage.getItem(CURRENT_PROJECT));