import { KEYS } from "../keys.js";

//only for gomel for now
export async function getWeather() {
  console.log(KEYS.weather);
  const locationKeyUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEYS.weather}&q=Gomel`;
  const getLocKey = await fetch(locationKeyUrl, { method: "GET" });
  const locKeyData = await getLocKey.json();
  console.log(locKeyData[0].Key);

  const weatheDataURL = `http://dataservice.accuweather.com/currentconditions/v1/${locKeyData[0]["Key"]}?apikey=${KEYS.weather}`;
  const getWeatherData = await fetch(weatheDataURL);
  const weatherJson = await getWeatherData.json();
  console.log(weatherJson);

  console.log("weather");
}
