const key = "todoshka";

export function getDataFromLocalStorage() {
  const data = localStorage.getItem(key);
  // console.log("data from local storage", data);
  return JSON.parse(data);
}

export function updateLocalStorage(data) {
  const json = JSON.stringify(data);
  localStorage.setItem(key, json);
}
