/*
coord = {
  lat: 22.2222,
  long: 33.333,
  city: undefined (if not found)
}
*/
//!add weather update time to todoshka  (later)
//!add localstorage keys onload? maybe
export const localCacheData = {
  coords: [],
};

export function updateLocalCacheData(key, data) {
  if (!key || !data) {
    console.log(`Sorry, no key: ${key} or no data: ${data}`);
    return;
  }
  if (key === "coords") localCacheData[key].push(data);
  else localCacheData[key] = data;
  console.log("local storage keys are up to date");
}

export function getDataFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  // console.log("data from local storage", data);
  return JSON.parse(data);
}

export function updateLocalStorage(data, key) {
  const json = JSON.stringify(data);
  localStorage.setItem(key, json);
}
