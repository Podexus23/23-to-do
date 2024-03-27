import { KEYS } from "../keys.js";
import {
  getDataFromLocalStorage,
  localCacheData,
  updateLocalCacheData,
  updateLocalStorage,
} from "./localStorage.js";

//!fake objects for testing
let cityObjData = {
  Key: "11123",
  EnglishName: "Shalapaevka",
  lat: "52,0000",
  lon: "40,5000",
};
let fakeWeatherData = [
  {
    Temperature: { Metric: { Value: 30.5, Unit: "C" } },
    WeatherText: "Sunny",
    WeatherIcon: 666,
  },
];

const weatherBlock = document.querySelector(".daily-info-weather");
const TIME_CYCLE = 1000 * 60 * 30; // 30min

const fetchWeatherData = async (placeKey) => {
  const weatherDataURL = `http://dataservice.accuweather.com/currentconditions/v1/${placeKey}?apikey=${KEYS.weather.accu}`;
  const getWeatherData = await fetch(weatherDataURL);
  const weatherJson = await getWeatherData.json();
  return weatherJson;
};

const renderWeatherData = (data) => {
  const temperature = document.createElement("span");
  temperature.textContent = `${data.Temperature.Metric.Value}${data.Temperature.Metric.Unit}`;
  const description = document.createElement("span");
  description.textContent = `${data.WeatherText}`;
  // const image = document.createElement("img");
  // image.alt = `icon n.${data.WeatherIcon}`;
  //!add emojis by given code number
  const image = document.createElement("span");
  image.innerHTML = `⛅${data.WeatherIcon}`;
  return [temperature, description, image];
};

const searchForCodeInLocalStorage = (cityName) => {
  const res = getDataFromLocalStorage(KEYS.task.coordsData).filter(
    (e) => e.name.toLowerCase() === cityName.toLowerCase()
  );
  if (res.length > 0) return res[0];
  return false;
};

const addBlockWithNavigationCoords = async (URL, lat, lon) => {
  //!faking placeJson
  const placeJson = cityObjData;
  // const getWeatherData = await fetch(URL);
  // const placeJson = await getWeatherData.json();

  // save or update all coords
  const localCoords = getDataFromLocalStorage(KEYS.task.coordsData);

  if (!localCoords || !searchForCodeInLocalStorage(placeJson.EnglishName)) {
    updateLocalCacheData("coords", {
      Key: placeJson.Key,
      name: placeJson.EnglishName,
      lat,
      lon,
    });
    updateLocalStorage(localCacheData.coords, KEYS.task.coordsData);
  }

  //check for cached weather, to save api calls
  const cachedWeatherData = getDataFromLocalStorage(KEYS.task.weatherTime);
  if (
    cachedWeatherData &&
    cachedWeatherData["time"] + TIME_CYCLE > Date.now()
  ) {
    weatherBlock.append(...renderWeatherData(cachedWeatherData.data[0]));
  } else {
    // const realWeatherData = await fetchWeatherData(placeJson.Key);
    //!fake weather data
    const realWeatherData = fakeWeatherData;
    weatherBlock.append(...renderWeatherData(realWeatherData[0]));
    updateLocalStorage(
      { time: Date.now(), data: realWeatherData },
      KEYS.task.weatherTime
    );
  }
};

//only by coords now
export async function getWeather() {
  let lat, lon;
  let cityURL = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${KEYS.weather.accu}&q=`;

  //check if coords are given
  let success = (pos) => {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    cityURL += `${lat},${lon}`;
    return true;
  };

  let error = (err) => {
    // console.warn(`ERROR(${err.code}): ${err.message}`);
    return err;
  };

  let coordsPromise = new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => res(success(pos)),
      (err) => rej(error(err))
    );
  });

  //if coords given
  try {
    if (await coordsPromise) {
      addBlockWithNavigationCoords(cityURL, lat, lon);
    }
  } catch (err) {
    //!add functionality by adding weather for city name
    weatherBlock.innerHTML = `<p>Sorry, no cords - no weather</p>`;
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  //!if not, give a chance to take data from city name(later)
  //!if not, remove weather block(later)

  // console.log(KEYS.weather.accu);
  // const locationKeyUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEYS.weather.accu}&q=Gomel`;
  // const getLocKey = await fetch(locationKeyUrl, { method: "GET" });
  // const locKeyData = await getLocKey.json();
  // console.log(locKeyData[0].Key);
}
