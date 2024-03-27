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

const weatherBlock = document.querySelector(".daily-info-weather");

const fetchWeatherData = async (placeKey) => {
  const weatherDataURL = `http://dataservice.accuweather.com/currentconditions/v1/${placeKey}?apikey=${KEYS.weather.accu}`;
  const getWeatherData = await fetch(weatherDataURL);
  const weatherJson = await getWeatherData.json();
  updateLocalStorage(
    { time: Date.now(), data: weatherJson },
    KEYS.task.weatherTime
  );
  return weatherJson;
};

const renderWeatherData = (data) => {
  console.log(data, "data");
  const temperature = document.createElement("span");
  temperature.textContent = `${data.Temperature.Metric.Value} ${data.Temperature.Metric.Unit}`;
  const description = document.createElement("span");
  description.textContent = `${data.WeatherText}`;
  const image = document.createElement("img");
  image.alt = `icon n.${data.WeatherIcon}`;
  return [temperature, description, image];
};

const searchForCodeInLocalStorage = (cityName) => {
  const res = getDataFromLocalStorage(KEYS.task.coordsData).filter(
    (e) => e.name === cityName
  );
  if (res.length > 0) return res[0];
  return false;
};

const addBlockWithNavigationCoords = async (URL, lat, lon) => {
  //!faking weatherJson
  const weatherJson = cityObjData;
  // const getWeatherData = await fetch(URL);
  // const weatherJson = await getWeatherData.json();
  const localCoords = getDataFromLocalStorage(KEYS.task.coordsData);

  if (!localCoords || !searchForCodeInLocalStorage(weatherJson.EnglishName)) {
    updateLocalCacheData("coords", {
      Key: weatherJson.Key,
      name: weatherJson.EnglishName,
      lat,
      lon,
    });
    updateLocalStorage(localCacheData.coords, KEYS.task.coordsData);
  }

  const realWeatherData = await fetchWeatherData(weatherJson.Key);
  weatherBlock.append(...renderWeatherData(realWeatherData[0]));

  let placeData = {
    Key: weatherJson.Key,
    name: weatherJson.EnglishName,
    lat,
    lon,
  };
};

//only gomel for now
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

  try {
    //if coords given
    if (await coordsPromise) {
      addBlockWithNavigationCoords(cityURL, lat, lon);
      console.log("hi coords");
    }
  } catch (err) {
    //!add functionality by adding weather for city name
    weatherBlock.innerHTML = `<p>Sorry, no cords - no weather</p>`;
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  //!if not, give a chance to take data from city name(later)
  //!if not, remove weather block(later)

  //if no, get city name, add this data to local storage and get data for that place

  //make time checker
  //if data has been taken less than 30min ago, use old data
  //else load new data and update time
  const savedWeather = getDataFromLocalStorage(KEYS.task.weatherTime);
  if (placeData && !savedWeather) {
    console.log(placeData);
    const weatheDataURL = `http://dataservice.accuweather.com/currentconditions/v1/${placeData["Key"]}?apikey=${KEYS.weather.accu}`;
    const getWeatherData = await fetch(weatheDataURL);
    const weatherJson = await getWeatherData.json();
    updateLocalStorage(
      { time: Date.now(), data: weatherJson },
      KEYS.task.weatherTime
    );
  } else {
    // const imgURL = `https://openweathermap.org/img/wn/10d@2x.png`;
    // const weatherImg = await fetch(imgURL);
    // const imgBlob = await weatherImg.blob();
    // const image = URL.createObjectURL(imgBlob);
    // const imageDoc = document.createElement("img");
    // imageDoc.src = image;
    // weatherBlock.append(imageDoc);
    // console.log(weatherImg);
  }

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
}
