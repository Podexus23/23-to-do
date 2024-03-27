import { makeElem } from "./helpers.js";

let timeCounterTimer;
const dateDataObj = {
  time: {
    min: 0,
    sec: 0,
    hours: 0,
  },
};

function runTime() {
  const dateData = new Date();
  const dailyTime = document.querySelector(".date-time");

  if (dateData.getMinutes() !== dateDataObj.time.min) {
    dateDataObj.time.hours = dateData.getHours();
    dateDataObj.time.min = dateData.getMinutes();
    let time = `${dateDataObj.time.hours
      .toString()
      .padStart(2, 0)}:${dateDataObj.time.min.toString().padStart(2, 0)}`;
    dailyTime.textContent = time;
  }
}

export const getHoursAndMinutes = (time = Date.now()) => {
  const dateData = new Date(time);

  let hours = dateData.getHours();
  let min = dateData.getMinutes();
  let timeString = `${hours.toString().padStart(2, 0)}:${min
    .toString()
    .padStart(2, 0)}`;
  return timeString;
};

export function addTimeOnPage() {
  const dateBlock = document.querySelector(".daily-info-date");
  const dailyTime = makeElem("span", "date-time");
  dateBlock.append(dailyTime);
  runTime();

  timeCounterTimer = setInterval(runTime, 1000);
}

[
  "Add better design solutions",
  "make pics of edit and close instead words and buttons",
  "add time stamp on each task",
  "on edit add text to edit form",
  "addd form to add keys for weather",
  "kind of options or smth for i don't know wwhy =)",
  "Fnd search for some tool for putting API keys without showing them",
];
