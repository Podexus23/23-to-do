import { KEYS } from "../keys.js";
import {
  getDataFromLocalStorage,
  localCacheData,
  updateLocalCacheData,
  updateLocalStorage,
} from "./localStorage.js";

const weatherIcons = (number = 1) => {
  let svgURL = `./assets/weatherIcons/static/`;
  switch (number) {
    case 1:
    case 2:
    case 30:
      svgURL += "day.svg";
      break;
    case 3:
    case 4:
    case 5:
      svgURL += "cloudy-day-1.svg";
      break;
    case 6:
    case 7:
    case 8:
    case 11:
    case 32:
      svgURL += "cloudy.svg";
      break;
    case 12:
    case 15:
    case 18:
      svgURL += "rainy-6.svg";
      break;
    case 13:
    case 14:
    case 16:
    case 17:
      svgURL += "rainy-3.svg";
      break;
    case 19:
    case 20:
    case 21:
      svgURL += "cloudy-day-3.svg";
      break;
    case 22:
    case 23:
    case 24:
    case 31:
    case 42:
      svgURL += "snowy-4.svg";
      break;
    case 25:
    case 26:
    case 29:
      svgURL += "rainy-7.svg";
      break;
    case 33:
    case 34:
      svgURL += "night.svg";
      break;
    case 35:
    case 36:
    case 37:
    case 38:
      svgURL += "cloudy-night-1.svg";
      break;
    case 39:
    case 40:
    case 41:
      svgURL += "cloudy-night-3.svg";
      break;
    default:
      svgURL += "day.svg";
      break;
  }
  return svgURL;
};

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
  const image = document.createElement("img");
  image.src = weatherIcons(data.WeatherIcon);
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
  //!fake placeJson
  const placeJson = cityObjData;
  // const getWeatherData = await fetch(URL);
  // const placeJson = await getWeatherData.json();

  // save or update all coords
  const localCityKeys = getDataFromLocalStorage(KEYS.task.coordsData);

  if (!localCityKeys || !searchForCodeInLocalStorage(placeJson.EnglishName)) {
    updateLocalCacheData("coords", {
      Key: placeJson.Key,
      name: placeJson.EnglishName,
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
    //!fake weather data
    const realWeatherData = fakeWeatherData;
    // const realWeatherData = await fetchWeatherData(placeJson.Key);
    weatherBlock.append(...renderWeatherData(realWeatherData[0]));
    updateLocalStorage(
      { time: Date.now(), data: realWeatherData },
      KEYS.task.weatherTime
    );
  }
};

const getKeyByPlaceName = async (placeName) => {
  const localCityKeys = getDataFromLocalStorage(KEYS.task.coordsData);

  if (!localCityKeys || !searchForCodeInLocalStorage(placeName)) {
    const locationKeyUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEYS.weather.accu}&q=${placeName}`;
    const getLocKey = await fetch(locationKeyUrl, { method: "GET" });
    const locKeyData = await getLocKey.json();
    console.log(locKeyData);

    if (locKeyData.length === 0) {
      const text = document.querySelector(".info-weather-heading");
      text.textContent =
        "Sorry, there is no data about this place, try smth different";
      return;
    } else {
      updateLocalCacheData("coords", {
        Key: locKeyData[0].Key,
        name: locKeyData[0].EnglishName,
      });
      updateLocalStorage(localCacheData.coords, KEYS.task.coordsData);

      // const realWeatherData = fakeWeatherData;
      const realWeatherData = await fetchWeatherData(
        searchForCodeInLocalStorage(placeName).Key
      );
      weatherBlock.append(...renderWeatherData(realWeatherData[0]));
      updateLocalStorage(
        { time: Date.now(), data: realWeatherData },
        KEYS.task.weatherTime
      );
    }
  } else {
    const realWeatherData = await fetchWeatherData(
      searchForCodeInLocalStorage(placeName).Key
    );
    weatherBlock.innerHTML = "";
    weatherBlock.append(...renderWeatherData(realWeatherData[0]));
    updateLocalStorage(
      { time: Date.now(), data: realWeatherData },
      KEYS.task.weatherTime
    );
  }
};

let addCityQuestionPlaceholder = () => {
  const text = document.createElement("p");
  text.textContent = "enter your city or place name to add weather on page";
  text.className = "info-weather-heading";
  text.classList.add("small-text");

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("info-weather-input");

  const button = document.createElement("button");
  button.classList.add("info-weather-button");
  button.classList.add("button");
  button.textContent = "Add";

  button.addEventListener("click", (e) => {
    const placeName = input.value.trim();
    getKeyByPlaceName(placeName);
  });

  weatherBlock.append(text);
  weatherBlock.append(input);
  weatherBlock.append(button);
};

let addWeatherByCityName = () => {
  addCityQuestionPlaceholder();
  // get place data

  // render error on wrong data
  // render data
  console.log("hi");
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
    if (err.code === 1) addWeatherByCityName();
    // weatherBlock.innerHTML = `<p>Sorry, no cords - no weather</p>`;
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
