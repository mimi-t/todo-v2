import { toDoInterface } from "./todo.js";
import { projectInterface } from "./project.js";
import * as util from "./util.js";
import './styles.css';

class DisplayController {
    // DOM related functions
}

const PROJECTS = "projects";
const CURRENT_PROJECT = "currentProject";
if (!localStorage.getItem(PROJECTS)) {
    // set up default Project if it is the user's first time using the app
    util.setToLocalStorage(PROJECTS, []);
    const newProject = projectInterface.createProject('New Project', []);
    util.setToLocalStorage(CURRENT_PROJECT, newProject.id);
}