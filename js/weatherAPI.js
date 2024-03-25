import { KEYS } from "../keys.js";
import {
  getDataFromLocalStorage,
  localCacheData,
  updateLocalCacheData,
  updateLocalStorage,
} from "./localStorage.js";

//only gomel for now
export async function getWeather() {
  let lat, lon;
  let cityURL = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${KEYS.weather.accu}&q=`;

  //check if coords are given
  let success = async (pos) => {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    cityURL += `${lat},${lon}`;
  };

  let error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    throw err;
  };

  let coordsPromise = new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => res(success(pos)),
      (err) => rej(error(err))
    );
  });

  try {
    await coordsPromise;
  } catch (error) {
    //!give proposition to add city
    console.dir(error);
  }
  //!if not, give a chance to take data from city name(later)
  //!if not, remove weather block(later)

  //if coords given
  //check if they are used in localStorage(make an array, with lat,lon data)
  const localCoords = getDataFromLocalStorage(KEYS.task.coordsData);
  if (localCoords) {
    //if yes, take the place and take data for that place
    console.log(localCoords);
  } else {
    const getWeatherData = await fetch(cityURL);
    const weatherJson = await getWeatherData.json();
    console.log(weatherJson);
    updateLocalCacheData("coords", {
      Key: weatherJson.Key,
      name: weatherJson.EnglishName,
      lat,
      lon,
    });
    updateLocalStorage(localCacheData.coords, KEYS.task.coordsData);
  }
  //if no, get city name, add this data to local storage and get data for that place

  //make time checker
  //if data has been taken less than 30min ago, use old data
  //else load new data and update time

  //!later option with given city

  // console.log(KEYS.weather.accu);
  // const locationKeyUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEYS.weather.accu}&q=Gomel`;
  // const getLocKey = await fetch(locationKeyUrl, { method: "GET" });
  // const locKeyData = await getLocKey.json();
  // console.log(locKeyData[0].Key);

  // const weatheDataURL = `http://dataservice.accuweather.com/currentconditions/v1/${locKeyData[0]["Key"]}?apikey=${KEYS.weather.accu}`;
  // const getWeatherData = await fetch(weatheDataURL);
  // const weatherJson = await getWeatherData.json();
  // console.log(weatherJson);

  // navigator.geolocation.getCurrentPosition(async (pos) => {
  //   console.log(pos);
  //   lat = pos.coords.latitude;
  //   lon = pos.coords.longitude;
  //   console.log(lat, lon);
  //   cityURL += `${lat},${lon}`;
  //   const getWeatherData = await fetch(cityURL);
  //   const weatherJson = await getWeatherData.json();
  //   console.log(weatherJson);
  // });
}
