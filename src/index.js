import { PROJECTS, CURRENT_PROJECT } from "./constants.js"
import { ToDoInterface } from "./todo.js";
import { ProjectInterface } from "./project.js";
import * as util from "./util.js";
import './styles.css';

const AppController = (() => {
    function addProject(name) {
    }

    function changeProjectName(id) {
    }

    function deleteProject(id) {
    }
    
    function getToDo(toDoId, projectId) {
    }

    function updateToDo(){
    }

    function deleteToDo(){
    }

    return { addProject, changeProjectName, deleteProject, getToDo, updateToDo, deleteToDo };
})();

const DisplayController = (() => {
    const projectList = document.querySelector("#project-list-container");
    const projectHeading = document.querySelector("#project-heading");
    const addProjectBtn = document.querySelector("#add-project-btn");
    const toDoList = document.querySelector("#todo-list");
    const addToDoBtn = document.querySelector("#add-todo-btn");
    // set up event listeners
})();

// localStorage.clear();
DisplayController.setUp();
if (!localStorage.getItem(PROJECTS)) {
    // set up default Project if it is the user's first time using the app
    util.setObjToLocalStorage(PROJECTS, []);
    const newProject = ProjectInterface.createProject('New Project', []);
    localStorage.setItem(CURRENT_PROJECT, newProject.id);
}

// const projId = localStorage.getItem(CURRENT_PROJECT);
// ProjectInterface.addToDoToProject(projId, [ToDoInterface.createToDo('clean dishes', 'wipe the sink after', new Date(), 'high')])
// ProjectInterface.updateProjectName(projId, 'asdsadasd');
// ProjectInterface.createProject('Another one', []);
// add to do to project