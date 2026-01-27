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
        // const projId = localStorage.getItem(CURRENT_PROJECT);
        // ProjectInterface.addToDoToProject({title: 'clean dishes', description: 'wipe the sink after', dueDate: new Date(), priority: 'high'}, projId);
        // const newProj = ProjectInterface.createProject('Another one', []);
        // ProjectInterface.addToDoToProject({title: 'psych homework', description: 'read page 10-22', dueDate: new Date(), priority: 'low'}, newProj.id);

        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const currentProject = ProjectInterface.getProject(localStorage.getItem(CURRENT_PROJECT));
        DisplayController.populateNav(allProjects);
        DisplayController.populateToDoListView(currentProject);
        DisplayController.setUpListeners();
    }

    function openProject(id) {
        const project = ProjectInterface.getProject(id);
        localStorage.setItem(CURRENT_PROJECT, id);
        DisplayController.populateToDoListView(project);
    }

    function addProject(name) {
        ProjectInterface.createProject(name, []);
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
    }

    function changeProjectName(id, newName) {
        ProjectInterface.updateProjectName(id, newName);
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
        DisplayController.populateHeading(newName);
    }

    function deleteProject(id) {
        ProjectInterface.deleteProject(id);
        if (localStorage.getItem(CURRENT_PROJECT) === id) {
            // if deleting current project open project at index 0 
            const firstProject = util.getObjFromLocalStorage(PROJECTS)[0];
            localStorage.setItem(CURRENT_PROJECT, firstProject.id);
            openProject(firstProject.id);
            DisplayController.populateToDoListView(firstProject);
        }
        DisplayController.populateNav(util.getObjFromLocalStorage(PROJECTS));
    }
    
    function openToDo(toDoId) {
        const toDoToOpen = ProjectInterface.getToDoInProject(toDoId, localStorage.getItem(CURRENT_PROJECT));
        DisplayController.populateToDoFormView(toDoToOpen);
        DisplayController.swapToDoView("form")
    }

    function toggleToDoComplete(toDoId) {
        // toggle completed for to do item with matching id in current project
        const currentProjectId = localStorage.getItem(CURRENT_PROJECT);
        const currentProject = ProjectInterface.getProject(currentProjectId);
        
        const toggleIndex = currentProject.toDos.findIndex(item => { return item.id === toDoId});
        const updatedToDo = ToDoInterface.toggleCompleted(currentProject.toDos[toggleIndex]);
        currentProject.toDos[toggleIndex] = updatedToDo;

        const allProjects = util.getObjFromLocalStorage(PROJECTS);
        const currentProjectIndex = ProjectInterface.getProjectIndex(currentProjectId);
        allProjects[currentProjectIndex] = currentProject;
        util.setObjToLocalStorage(PROJECTS, allProjects);
    }

    function addToDo(toDoData) {
        const updatedProject = ProjectInterface.addToDoToProject(toDoData, localStorage.getItem(CURRENT_PROJECT));
        DisplayController.populateToDoListView(updatedProject);
        DisplayController.swapToDoView("list");
    }

    function updateToDo(){
    }

    function deleteToDo(){
    }

    return { startApp, openProject, addProject, changeProjectName, deleteProject, openToDo, toggleToDoComplete, addToDo, updateToDo, deleteToDo };
})();

const DisplayController = (() => {
    const projectList = document.querySelector("#project-list-container");
    const projectHeading = document.querySelector("#project-heading");
    const projectDialog = document.querySelector('#project-dialog');
    const projectDialogConfirmBtn = document.querySelector("#project-dialog .confirm-btn ");
    const toDoListView = document.querySelector('#todo-list-view');
    const toDoFormView = document.querySelector('#todo-form-view');
    const toDoForm = document.forms["todo-form"];
    const deleteDialog = document.querySelector("#confirm-delete-dialog");
    
    function populateNav(projects) {
        projectList.innerHTML = "";
        projects.forEach(project => {
            const projectContainer = document.createElement("div");
            projectContainer.classList.add("project-item");
            projectContainer.addEventListener("click", () => {
                AppController.openProject(project.id);
            });

            // Project navigation item - name and more icon
            const projectText = document.createElement("p");
            projectText.textContent = project.name;
            const iconImage = document.createElement("svg");
            iconImage.classList.add("project-more-icon");
            iconImage.innerHTML = moreIcon;
            iconImage.addEventListener("click", e => {
                e.stopPropagation();
                // close any other currently open dropdown
                const dropdownToClose = document.querySelector(".project-dropdown:not(.hide)");
                if (dropdownToClose) {
                    dropdownToClose.classList.toggle("hide");
                }
                // open dropdown
                dropdownContainer.classList.toggle("hide");
            });

            // Dropdown for edit and delete project options
            const dropdownContainer = document.createElement("div");
            dropdownContainer.classList.add("project-dropdown", "hide");

            const editProject = document.createElement("div");
            editProject.textContent = "Edit"
            editProject.addEventListener("click", e => {
                e.stopPropagation();
                projectDialog.dataset.id = project.id;
                projectDialog.dataset.mode = "edit";
                projectDialogConfirmBtn.textContent = "Update";
                projectDialog.showModal();
            });

            const deleteProject = document.createElement("div");
            deleteProject.textContent = "Delete";
            deleteProject.addEventListener("click", e => {
                e.stopPropagation();
                deleteDialog.dataset.id = project.id;
                deleteDialog.dataset.item = "project";
                const dialogMessage = document.querySelector("#confirm-delete-dialog .confirmation-message");
                dialogMessage.textContent = `Are you sure you want to delete "${project.name}"?`;
                deleteDialog.showModal();
            });

            if (projects.length > 1) {
                dropdownContainer.append(editProject, deleteProject);
            } else {
                dropdownContainer.append(editProject);
            }

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

    function populateHeading(heading) {
        projectHeading.textContent = heading;
    }

    function populateToDoListView(project) {
        populateHeading(project.name);
        const toDoList = document.querySelector("#todo-list");
        toDoList.innerHTML = "";
        project.toDos.forEach(toDo => {
            const toDoDiv = document.createElement("div");
            toDoDiv.classList.add("todo-item");
            toDoDiv.dataset.id = toDo.id;

            const toDoCheckbox = document.createElement("input");
            toDoCheckbox.setAttribute("type", "checkbox");
            toDoCheckbox.checked = toDo.completed ? true : false;
            toDoCheckbox.addEventListener("change", () => {
                AppController.toggleToDoComplete(toDo.id);
            });
            
            const toDoTitle = document.createElement("p");
            toDoTitle.textContent = toDo.title;
            const toDoDate = document.createElement("p");
            toDoDate.textContent = format(toDo.dueDate, "Pp");
            const toDoDetailsDiv = document.createElement("div");
            toDoDetailsDiv.classList.add("todo-item-details");
            toDoDetailsDiv.append(toDoTitle, toDoDate);
            toDoDetailsDiv.addEventListener("click", e => {
                toDoForm.dataset.mode = "edit";
                AppController.openToDo(toDo.id);
            });

            toDoDiv.append(toDoCheckbox, toDoDetailsDiv);
            toDoList.append(toDoDiv);
        });
    }

    function populateToDoFormView(toDo) {
        // reset form and hide checkbox for completed status if creating a new to do task
        toDoForm.reset();
        const completedInputType = toDoForm.dataset.mode === "create" ? "hidden" : "checkbox";
        document.forms["todo-form"].elements.namedItem("completed").setAttribute("type", completedInputType)
        fillForm("todo-form", toDo);
    }

    function fillForm(formName, formData) {
        const formInputs = document.forms[formName].elements;
        for (const field in formData) {
            let inputValue = formData[field];
            if (field.toUpperCase().includes("DATE")) {
                inputValue = formData[field].slice(0,16);
            } 
            formInputs.namedItem(field).value = inputValue;
        }
    }

    function swapToDoView(view) {
        if (view === "list") {
            toDoListView.classList.remove("hide");
            toDoFormView.classList.add("hide");
        } else if (view === "form") {
            toDoFormView.classList.remove("hide");
            toDoListView.classList.add("hide");
        }
    }

    function setUpListeners() {
        // Project listeners
        const addProjectBtn = document.querySelector("#add-project-btn");
        const projectForm = document.forms["project-form"];
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
        const cancelToDoFormBtn = document.querySelector("#todo-form-view .cancel-btn ");

        addToDoBtn.addEventListener("click", () => {
            toDoForm.dataset.mode = "create";
            populateToDoFormView({});
            swapToDoView("form");
        });

        toDoForm.addEventListener("submit", e => {
            e.preventDefault();
            const formData = new FormData(toDoForm);
            if (toDoForm.dataset.mode === "create") {
                AppController.addToDo(formData);
            } else if (toDoForm.dataset.mode === "edit") {
                // AppController.updateToDo(formData);
            }
            toDoForm.dataset.mode = "";
            swapToDoView("list");
            toDoForm.reset();
        });

        cancelToDoFormBtn.addEventListener("click", () => {
            swapToDoView("list");
            toDoForm.reset();
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

    return { populateNav, populateHeading, populateToDoListView, populateToDoFormView, swapToDoView, setUpListeners };
})();

document.addEventListener('DOMContentLoaded', () => {
    AppController.startApp();
});