import { PROJECTS, CURRENT_PROJECT } from "./constants.js"
import { ToDoInterface } from "./todo.js";
import { ProjectInterface } from "./project.js";
import * as util from "./util.js";
import './styles.css';
import { format } from "date-fns";

const AppController = (() => {
    function startApp() {
        localStorage.clear();
        if (!localStorage.getItem(PROJECTS)) {
            // set up default Project if it is the user's first time using the app
            util.setObjToLocalStorage(PROJECTS, []);
            const newProject = ProjectInterface.createProject('New Project', []);
            localStorage.setItem(CURRENT_PROJECT, newProject.id);
        }
        const projId = localStorage.getItem(CURRENT_PROJECT);
        ProjectInterface.addToDoToProject(projId, ToDoInterface.createToDo('clean dishes', 'wipe the sink after', new Date(), 'high'))
        ProjectInterface.createProject('Another one', []);

        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const currentProject = ProjectInterface.getProject(localStorage.getItem(CURRENT_PROJECT));
        DisplayController.populateNav(allProjects);
        DisplayController.populateMain(currentProject);
        DisplayController.setUpListeners();
    }

    function openProject(id) {
    }

    function addProject(name) {
        ProjectInterface.createProject(name, []);
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
    }

    function changeProjectName(id) {
    }

    function deleteProject(id) {
    }
    
    function getToDo(toDoId, projectId) {
    }

    function toggleToDoComplete(toDoId) {
        // toggle completed for to do item with matching id in current project
        const currentProjectId = localStorage.getItem(CURRENT_PROJECT);
        const currentProject = ProjectInterface.getProject(currentProjectId);
        const currentToDos = currentProject.toDos
        
        const toggleIndex = currentToDos.findIndex(item => { return item.id === toDoId});
        const updatedToDo = ToDoInterface.toggleCompleted(currentToDos[toggleIndex]);
        currentProject.toDos[toggleIndex] = updatedToDo;

        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const currentProjectIndex = ProjectInterface.getProjectIndex(currentProjectId);
        allProjects[currentProjectIndex] = currentProject;
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function updateToDo(){
    }

    function deleteToDo(){
    }

    return { startApp, addProject, changeProjectName, deleteProject, getToDo, toggleToDoComplete, updateToDo, deleteToDo };
})();

const DisplayController = (() => {
    const projectList = document.querySelector("#project-list-container");
    const projectHeading = document.querySelector("#project-heading");
    const toDoList = document.querySelector("#todo-list");
    
    function populateNav(projects) {
        projectList.innerHTML = "";
        projects.forEach(project => {
            const projectItem = document.createElement("li");
            projectItem.textContent = project.name;
            projectList.append(projectItem);
        });
    }

    function populateMain(project) {
        projectHeading.textContent = project.name;
        project.toDos.forEach(toDo => {
            const toDoDiv = document.createElement("div");
            toDoDiv.dataset.id = toDo.id;

            const toDoCheckbox = document.createElement("input");
            toDoCheckbox.setAttribute("type", "checkbox");
            toDoCheckbox.checked = toDo.completed ? true : false;
            toDoCheckbox.addEventListener("change", e => {
                AppController.toggleToDoComplete(toDo.id);
            });
            
            const toDoTitle = document.createElement("p");
            toDoTitle.textContent = toDo.title;
            
            const toDoDate = document.createElement("p");
            toDoDate.textContent = format(toDo.dueDate, "Pp");
            
            toDoDiv.append(toDoCheckbox, toDoTitle, toDoDate);
            toDoList.append(toDoDiv);
        });
    }

    function setUpListeners() {
        // Project listeners
        const addProjectBtn = document.querySelector("#add-project-btn");
        const projectDialog = document.querySelector('#project-dialog');
        const projectForm = document.querySelector("#project-form");
        const projectDialogCancelBtn = document.querySelector("#project-dialog .cancel-btn ");
        const projectDialogConfirmBtn = document.querySelector("#project-dialog .confirm-btn ");

        addProjectBtn.addEventListener("click", () => {
            projectDialog.showModal();
        });

        projectDialogCancelBtn.addEventListener("click", () => {
            projectDialog.close();
        });

        projectDialogConfirmBtn.addEventListener("click", e => {
            const formData = new FormData(projectForm);
            AppController.addProject(formData.get("name".trim()));
        });

        // To do task listeners
        const addToDoBtn = document.querySelector("#add-todo-btn");
        const toDoDialog = document.querySelector('#todo-dialog');
        const toDoDialogCancelBtn = document.querySelector("#todo-dialog .cancel-btn ");

        addToDoBtn.addEventListener("click", () => {
            toDoDialog.showModal();
        });

        toDoDialogCancelBtn.addEventListener("click", () => {
            toDoDialog.close();
        });
    }

    return { populateNav, populateMain, setUpListeners };
})();

document.addEventListener('DOMContentLoaded', () => {
    AppController.startApp();
});