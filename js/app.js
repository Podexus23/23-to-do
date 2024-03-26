import { KEYS } from "../keys.js";
import { addTimeOnPage } from "./date.js";
import { makeElem } from "./helpers.js";
import {
  getDataFromLocalStorage,
  updateLocalCacheData,
  updateLocalStorage,
} from "./localStorage.js";
import { getWeather } from "./weatherAPI.js";

const tasks = [];
const form = document.querySelector(".add-task-form");
const tasksList = document.querySelector(".to-do-tasks-list");

function removeTask(e) {
  const task = e.target.closest(".tasks-list_task");
  const taskText = task.querySelector(".tasks-list_task-text");
  const index = tasks.findIndex((e) => e === taskText.textContent);

  tasks.splice(index, 1);
  task.parentNode.removeChild(task);
  updateLocalStorage(tasks, KEYS.task.localStorageKey);
}

function editTask(e) {
  const task = e.target.closest(".tasks-list_task");
  const taskText = task.querySelector(".tasks-list_task-text");
  const textArea = makeElem("textarea", "edit-elem");
  const editSaveBtn = makeElem("button", "edit-save-btn");
  editSaveBtn.textContent = "save";

  function onEditSave() {
    const data = textArea.value;
    const index = tasks.findIndex((e) => e === taskText.textContent);
    task.removeChild(textArea);
    task.removeChild(editSaveBtn);
    taskText.textContent = data;
    tasks[index] = data;

    updateLocalStorage(tasks, KEYS.task.localStorageKey);
    editSaveBtn.removeEventListener("click", onEditSave);
  }

  editSaveBtn.addEventListener("click", onEditSave);
  task.prepend(editSaveBtn);
  task.prepend(textArea);
}

function addTask(e) {
  if (typeof e !== "string") e.preventDefault();

  const taskData = typeof e !== "string" ? e.target[0].value : e;
  if (e.target) e.target[0].value = "";

  const taskDiv = makeElem("div", "tasks-list_task");
  const taskText = makeElem("span", "tasks-list_task-text");
  taskText.textContent = taskData;

  const taskButtons = makeElem("div", "tasks-list_buttons");

  const taskRemoveBtn = makeElem("button", "tasks-list_remove-btn");
  taskRemoveBtn.textContent = "x";
  taskRemoveBtn.addEventListener("click", removeTask);

  const taskEditBtn = makeElem("button", "tasks-list_edit-btn");
  taskEditBtn.textContent = "edit";
  taskEditBtn.addEventListener("click", editTask);

  taskDiv.append(taskText);
  taskButtons.append(taskEditBtn);
  taskButtons.append(taskRemoveBtn);
  taskDiv.append(taskButtons);
  tasksList.append(taskDiv);

  tasks.push(taskData);
  updateLocalStorage(tasks, KEYS.task.localStorageKey);
}

form.addEventListener("submit", addTask);
getDataFromLocalStorage(KEYS.task.localStorageKey).forEach((task) =>
  addTask(task)
);
updateLocalCacheData("coords", ...getDataFromLocalStorage("todoCoords"));

addTimeOnPage();
getWeather();
