import { makeElem } from "./helpers.js";

const form = document.querySelector(".add-task-form");
const tasksList = document.querySelector(".to-do-tasks-list");

function addTask(e) {
  e.preventDefault();
  const taskData = e.target[0].value;
  const taskDiv = makeElem("div", "tasks-list_task");
  taskDiv.textContent = taskData;
  tasksList.append(taskDiv);
}

form.addEventListener("submit", addTask);
