const localStorage = window.localStorage;
const newTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");
const taskInput = document.querySelector(".new-task-input");
const modeButton = document.querySelector(".mode-button");
const docBody = document.querySelector("body");
const cleanAllTasksButton = document.querySelector(".clean-all-button");
const newTaskInput = document.querySelector(".new-task-input");
const emptyInputMessage = document.querySelector(".empty-input-message");
let currentTheme;
let checkboxes;
let tasksStorage = [];

let taskCount = 0;
class Task {
  constructor(task) {
    this.id = taskCount++;
    this.task = task;
    this.isChecked = false;
  }
}

/*TASKS RELATED FUNCTIONS */

function generateTasksHTML(tasks) {
  if (!tasks || tasks.length === 0) return getNoTasksLeftMessage();
  let html = "";
  tasks.map((task) => {
    html += `<li class="task-container">
    <input type="checkbox" class="checkbox" ${
      task.isChecked ? "checked" : ""
    }/><span id="${task.id}" class="task"
      >${task.task}</span
    ><!--<ion-icon class="icon edit-icon" name="pencil-outline"></ion-icon>-->
   
  </li>`;
  });
  return html;
}

function saveTask(task) {
  const taskObj = new Task(task);
  tasksStorage.push(taskObj);
  updateTasksItemsOnLocalStorage();
}

function updateTasksItemsOnLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksStorage));
}

function insertHTMLInTasksContainer(html) {
  tasksContainer.innerHTML = "";
  tasksContainer.insertAdjacentHTML("beforeend", html);
}

function cleanTaskInput() {
  taskInput.value = "";
}

function loadTasksFromLocalStorage() {
  tasksStorage = JSON.parse(localStorage.getItem("tasks"));
  if (!tasksStorage) tasksStorage = [];
}

function getNoTasksLeftMessage() {
  return `<span class="no-tasks-message">Looks like you don't have any tasks left! 😀</span>`;
}

function cleanAllTasks() {
  taskCount = 0;
  deleteTasks();
  updateTasksItemsOnLocalStorage();
  insertHTMLInTasksContainer(getNoTasksLeftMessage());
}

function deleteTasks() {
  tasksStorage = [];
}

function showEmptyInputMessage() {
  emptyInputMessage.style.display = "inline-block";
}

/*LIGHT MODE UPDATERS */

function updateBodyStyle(isLight) {
  if (isLight) docBody.classList.add("light-mode-body");
  else docBody.classList.remove("light-mode-body");
}

function updateModeButtonStyle(isLight) {
  if (isLight) {
    modeButton.classList.add("light-mode-button");
    modeButton.querySelector(".button-text").textContent = "light";
  } else {
    modeButton.classList.remove("light-mode-button");
    modeButton.querySelector(".button-text").textContent = "dark";
  }
}

function updateCleanButtonStyle(isLight) {
  if (isLight) cleanAllTasksButton.classList.add("light-mode-clean-button");
  else cleanAllTasksButton.classList.remove("light-mode-clean-button");
}

function updateCurrentThemeOnLocalStorage() {
  localStorage.setItem("currentTheme", currentTheme);
}

function updateToLightModeStyle() {
  updateBodyStyle(true);
  updateCleanButtonStyle(true);
  updateModeButtonStyle(true);
}

function updateToDarkModeStyle() {
  updateBodyStyle(false);
  updateCleanButtonStyle(false);
  updateModeButtonStyle(false);
}

/* EVENT LISTENERS FUNCTIONS */

function createNewTask(e) {
  e.preventDefault();
  if (e.target.closest(".new-task-button")) {
    if (!taskInput.value || taskInput.value === "") {
      showEmptyInputMessage();
      return;
    }
    saveTask(taskInput.value);
    const html = generateTasksHTML(tasksStorage);
    insertHTMLInTasksContainer(html);
    cleanTaskInput();
    checkboxes = document.querySelectorAll(".checkbox");
    listenToCheckboxes();
  }
}

function loadAndDisplayTasksFromLocalStorage() {
  loadTasksFromLocalStorage();
  taskCount = tasksStorage.slice(-1).id;
  const html = generateTasksHTML(tasksStorage);
  insertHTMLInTasksContainer(html);
  checkboxes = document.querySelectorAll(".checkbox");
  listenToCheckboxes();
}

function switchTheme(e) {
  const button = e.target.closest(".mode-button");
  if (!button) return;
  if (button.classList.contains("light-mode-button")) updateToDarkModeStyle();
  else updateToLightModeStyle();

  currentTheme = modeButton.querySelector(".button-text").textContent;
  updateCurrentThemeOnLocalStorage();
}

function checkboxListener(e) {
  const target = e.target;
  const taskId = e.target.nextElementSibling.id;
  tasksStorage.forEach((task) => {
    if (target.checked) {
      if (task.id === Number(taskId)) task.isChecked = true;
    } else {
      if (task.id === Number(taskId)) task.isChecked = false;
    }
  });

  updateTasksItemsOnLocalStorage();
}

function loadAndDisplayCurrentThemeFromLocalStorage() {
  currentTheme = localStorage.getItem("currentTheme");
  if (currentTheme == "light") updateToLightModeStyle();
  else updateToDarkModeStyle();
}

/* EVENT LISTENERS*/
newTaskButton.addEventListener("click", (e) => createNewTask(e));

window.addEventListener("load", function (e) {
  loadAndDisplayTasksFromLocalStorage();
  loadAndDisplayCurrentThemeFromLocalStorage();
});

modeButton.addEventListener("click", (e) => switchTheme(e));

cleanAllTasksButton.addEventListener("click", (e) => cleanAllTasks(e));

function listenToCheckboxes() {
  checkboxes.forEach((checkboxe) => {
    checkboxe.addEventListener("click", function (e) {
      checkboxListener(e);
    });
  });
}

newTaskInput.addEventListener("focus", (e) => {
  emptyInputMessage.style.display = "none";
});
