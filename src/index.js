import { PROJECTS, CURRENT_PROJECT } from "./constants.js"
import { ToDoInterface } from "./todo.js";
import { ProjectInterface } from "./project.js";
import * as util from "./util.js";
import './styles.css';
import { format } from "date-fns";
import moreIcon from "./assets/images/dots-horizontal.svg";

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

    function changeProjectName(id, newName) {
        ProjectInterface.updateProjectName(id, newName);
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
    }

    function deleteProject(id) {
        ProjectInterface.deleteProject(id);
        // todo: if deleting current project open index 0 project
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
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
    const projectDialog = document.querySelector('#project-dialog');
    const projectDialogConfirmBtn = document.querySelector("#project-dialog .confirm-btn ");
    const toDoList = document.querySelector("#todo-list");
    const deleteDialog = document.querySelector("#confirm-delete-dialog");
    
    function populateNav(projects) {
        projectList.innerHTML = "";
        projects.forEach(project => {
            const projectContainer = document.createElement("div");
            projectContainer.classList.add("project-item");

            // Project navigation item
            const projectText = document.createElement("p");
            projectText.textContent = project.name;
            const iconImage = document.createElement("svg");
            iconImage.classList.add("project-more-icon");
            iconImage.innerHTML = moreIcon;
            iconImage.addEventListener("click", e => {
                // close any other currently open dropdown
                const dropdownToClose = document.querySelector(".project-dropdown:not(.hide)");
                if (dropdownToClose) {
                    dropdownToClose.classList.toggle("hide");
                }
                // open dropdown
                dropdownContainer.classList.toggle("hide");
                e.stopPropagation();
            });

            // Dropdown for editing and deleting project
            const dropdownContainer = document.createElement("div");
            dropdownContainer.classList.add("project-dropdown", "hide");

            const editProject = document.createElement("div");
            editProject.textContent = "Edit"
            editProject.addEventListener("click", () => {
                projectDialog.dataset.id = project.id;
                projectDialog.dataset.mode = "edit";
                projectDialogConfirmBtn.textContent = "Update";
                projectDialog.showModal();
            });

            const deleteProject = document.createElement("div");
            deleteProject.textContent = "Delete";
            if (projects.length > 1) {
                deleteProject.addEventListener("click", () => {
                    deleteDialog.dataset.id = project.id;
                    deleteDialog.dataset.item = "project";
                    const dialogMessage = document.querySelector("#confirm-delete-dialog .confirmation-message");
                    dialogMessage.textContent = `Are you sure you want to delete "${project.name}"?`;
                    deleteDialog.showModal();
                });
            }
            
            dropdownContainer.append(editProject, deleteProject);
            projectContainer.append(projectText, iconImage, dropdownContainer);
            projectList.append(projectContainer);
        });

        // close dropdown when clicking outside
        const projectDropdowns = document.querySelectorAll(".project-dropdown");
        document.addEventListener('click', e => {
            const clickedOutsideDropdown = !Array.from(projectDropdowns).some(dropdown => e.composedPath().includes(dropdown));
            const dropdownToClose = document.querySelector(".project-dropdown:not(.hide)");
            if (clickedOutsideDropdown && dropdownToClose) {
                dropdownToClose.classList.toggle("hide");
            }
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
        const projectForm = document.querySelector("#project-form");
        const projectDialogCancelBtn = document.querySelector("#project-dialog .cancel-btn ");

        addProjectBtn.addEventListener("click", () => {
            projectDialog.dataset.mode = "create";
            projectDialogConfirmBtn.textContent = "Add";
            projectDialog.showModal();
        });

        projectDialogCancelBtn.addEventListener("click", () => {
            projectForm.reset()
            projectDialog.close();
        });

        projectForm.addEventListener("submit", e => {
            e.preventDefault();
            const formData = new FormData(projectForm);
            const newName = formData.get("name".trim());
            if (projectDialog.dataset.mode === "create") {
                AppController.addProject(newName);
            } else if (projectDialog.dataset.mode === "edit") {
                AppController.changeProjectName(projectDialog.dataset.id, newName);
            }
            projectDialog.dataset.mode = "";
            projectDialog.close();
            projectForm.reset();
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

        // Other listeners
        const deleteDialogDeleteBtn = document.querySelector("#confirm-delete-dialog .delete-btn");
        const deleteDialogCancelBtn = document.querySelector("#confirm-delete-dialog .cancel-btn");
        deleteDialogDeleteBtn.addEventListener("click", () => {
            if (deleteDialog.dataset.item === "project") {
                AppController.deleteProject(deleteDialog.dataset.id);
            } else if (deleteDialog.dataset.item === "todo") {
                // AppController.deleteToDo(deleteDialog.dataset.id)
            }
            deleteDialog.dataset.item = "";
            deleteDialog.close();
        });

        deleteDialogCancelBtn.addEventListener("click", () => {
            deleteDialog.close();
        });
    }

    return { populateNav, populateMain, setUpListeners };
})();

document.addEventListener('DOMContentLoaded', () => {
    AppController.startApp();
});