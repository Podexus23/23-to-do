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
    let time = `${dateDataObj.time.hours}:${dateDataObj.time.min}`;
    dailyTime.textContent = time;
  }
}

export function addTimeOnPage() {
  const dateBlock = document.querySelector(".daily-info-date");
  const dailyTime = makeElem("span", "date-time");
  dateBlock.append(dailyTime);
  runTime();

  timeCounterTimer = setInterval(runTime, 1000);
}
