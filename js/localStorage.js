//!add localstorage keys onload? maybe
export const localCacheData = {
  coords: [],
};

export function updateLocalCacheData(key, data) {
  if (!key || !data) {
    console.log(`Sorry, no key: ${key} or no data: ${data}`);
    return;
  }
  if (key === "coords") {
    if (Array.isArray(data)) localCacheData[key].push(...data);
    else localCacheData[key].push(data);
  } else localCacheData[key] = data;
  console.log("local storage keys are up to date");
}

export function getDataFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return JSON.parse(data);
}

export function updateLocalStorage(data, key) {
  const json = JSON.stringify(data);
  localStorage.setItem(key, json);
}
