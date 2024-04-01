import "../css/style.css";
import "../css/test.css";

import { KEYS } from "../keys.js";
import { addTimeOnPage, getHoursAndMinutes } from "./date.js";
import { makeElem } from "./helpers.js";
import {
  getDataFromLocalStorage,
  localCacheData,
  updateLocalCacheData,
  updateLocalStorage,
} from "./localStorage.js";
import { getWeather } from "./weatherAPI.js";

const tasksContainer = [];
const form = document.querySelector(".add-task-form");
const tasksList = document.querySelector(".to-do-tasks-list");

function removeTask(e) {
  const task = e.target.closest(".tasks-list_task");
  const taskText = task.querySelector(".tasks-list_task-text");
  const index = tasksContainer.findIndex((e) => e === taskText.textContent);

  tasksContainer.splice(index, 1);
  task.parentNode.removeChild(task);
  updateLocalStorage(tasksContainer, KEYS.task.localStorageKey);
}

function editTask(e) {
  const task = e.target.closest(".tasks-list_task");
  const taskText = task.querySelector(".tasks-list_task-text");
  const textArea = makeElem("textarea", "edit-elem");
  const editSaveBtn = makeElem("button", "edit-save-btn");
  textArea.value = taskText.textContent;
  editSaveBtn.textContent = "save";

  function onEditSave() {
    const data = textArea.value;
    const index = tasksContainer.findIndex((e) => e === taskText.textContent);
    task.removeChild(textArea);
    task.removeChild(editSaveBtn);
    taskText.textContent = data;
    tasksContainer[index] = data;

    updateLocalStorage(tasksContainer, KEYS.task.localStorageKey);
    editSaveBtn.removeEventListener("click", onEditSave);
  }

  editSaveBtn.addEventListener("click", onEditSave);
  task.prepend(editSaveBtn);
  task.prepend(textArea);
}

function addTask(e) {
  if (typeof e.data !== "string") e.preventDefault();

  // const taskData = typeof e !== "string" ? e.target[0].value : e;
  const task = {
    time: e.time ? e.time : Date.now(),
    data: typeof e.data !== "string" ? e.target[0].value : e.data,
  };
  if (e.target) e.target[0].value = "";

  const taskTime = makeElem("div", "tasks-list_time");
  taskTime.textContent = `${getHoursAndMinutes(task.time)}`;

  const taskDiv = makeElem("div", "tasks-list_task");
  const taskText = makeElem("span", "tasks-list_task-text");
  taskText.textContent = `${task.data}`;

  const taskButtons = makeElem("div", "tasks-list_buttons");

  const taskRemoveBtn = makeElem("button", "tasks-list_remove-btn");
  taskRemoveBtn.textContent = "x";
  taskRemoveBtn.addEventListener("click", removeTask);

  const taskEditBtn = makeElem("button", "tasks-list_edit-btn");
  taskEditBtn.textContent = "edit";
  taskEditBtn.addEventListener("click", editTask);

  taskDiv.append(taskTime);
  taskDiv.append(taskText);
  taskButtons.append(taskEditBtn);
  taskButtons.append(taskRemoveBtn);
  taskDiv.append(taskButtons);
  tasksList.append(taskDiv);

  tasksContainer.push(task);
  updateLocalStorage(tasksContainer, KEYS.task.localStorageKey);
}

form.addEventListener("submit", addTask);

getDataFromLocalStorage(KEYS.task.localStorageKey).forEach((task) =>
  addTask(task)
);

if (getDataFromLocalStorage(KEYS.task.coordsData)) {
  updateLocalCacheData("coords", getDataFromLocalStorage(KEYS.task.coordsData));
}

addTimeOnPage();
getWeather();
