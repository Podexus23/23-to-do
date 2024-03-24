import { makeElem } from "./helpers.js";

const form = document.querySelector(".add-task-form");
const tasksList = document.querySelector(".to-do-tasks-list");

function removeTask(e) {
  e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

function editTask(e) {
  const task = e.target.parentNode;
  const textArea = makeElem("textarea", "edit-elem");
  const editSaveBtn = makeElem("button", "edit-save-btn");
  editSaveBtn.textContent = "save";

  function onEditSave(e) {
    const data = textArea.value;
    task.removeChild(textArea);
    task.removeChild(editSaveBtn);
    task.textContent = data;

    const taskRemoveBtn = makeElem("button", "tasks-list_remove-btn");
    taskRemoveBtn.textContent = "x";
    taskRemoveBtn.addEventListener("click", removeTask);

    const taskEditBtn = makeElem("button", "tasks-list_edit-btn");
    taskEditBtn.textContent = "edit";
    taskEditBtn.addEventListener("click", editTask);

    task.append(taskEditBtn);
    task.append(taskRemoveBtn);

    editSaveBtn.removeEventListener("click", onEditSave);
  }

  editSaveBtn.addEventListener("click", onEditSave);
  task.prepend(editSaveBtn);
  task.prepend(textArea);
}

function addTask(e) {
  e.preventDefault();
  const taskData = e.target[0].value;

  const taskDiv = makeElem("div", "tasks-list_task");
  taskDiv.textContent = taskData;

  const taskRemoveBtn = makeElem("button", "tasks-list_remove-btn");
  taskRemoveBtn.textContent = "x";
  taskRemoveBtn.addEventListener("click", removeTask);

  const taskEditBtn = makeElem("button", "tasks-list_edit-btn");
  taskEditBtn.textContent = "edit";
  taskEditBtn.addEventListener("click", editTask);

  taskDiv.append(taskEditBtn);
  taskDiv.append(taskRemoveBtn);
  tasksList.append(taskDiv);
}

function addFakeTask(textData) {
  const taskData = textData;

  const taskDiv = makeElem("div", "tasks-list_task");
  taskDiv.textContent = taskData;

  const taskRemoveBtn = makeElem("button", "tasks-list_remove-btn");
  taskRemoveBtn.textContent = "x";
  taskRemoveBtn.addEventListener("click", removeTask);

  const taskEditBtn = makeElem("button", "tasks-list_edit-btn");
  taskEditBtn.textContent = "edit";
  taskEditBtn.addEventListener("click", editTask);

  taskDiv.append(taskEditBtn);
  taskDiv.append(taskRemoveBtn);
  tasksList.append(taskDiv);
}

form.addEventListener("submit", addTask);
addFakeTask("123");
addFakeTask("asd123");
addFakeTask("ajbgaioerbhizfbsitb");
addFakeTask("--");
