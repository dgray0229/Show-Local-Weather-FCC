// Location Variables
var changeTempLocation = document.querySelector("#change-temp-unit"),
  cityLocation = document.querySelector("#city"),
  iconLocation = document.querySelector("#icon"),
  weatherLocation = document.querySelector("#weather"),
  windLocation = document.querySelector("#wind"),
  humidityLocation = document.querySelector("#humidity");

// Functions
function success(pos) {
  // For when getting Location is Successful

  var crd = pos.coords;

  // console.log('Your current position is:');
  // console.log(`Latitude : ${crd.latitude}`);
  // console.log(`Longitude: ${crd.longitude}`);
  // console.log(`More or less ${crd.accuracy} meters.`);

  // Send AJAX Request using Coordinates passed in from Geolocation
  requestWeatherInformation(crd);
}
function error(err) {
  // When there is an error trying to get the location
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
var options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
};
function requestWeatherInformation(crd) {
  // Creating the AJAX Request
  var request = new XMLHttpRequest(),
    url = [
      "https://fcc-weather-api.glitch.me/",
      "/api/current?",
      "lon=",
      crd.longitude,
      "&lat=",
      crd.latitude
    ].join("");
  console.log(url);

  // Opening the AJAX Request
  request.open("GET", url, true);

  // Checking to Make sure that the Request is Successful
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var response = JSON.parse(request.responseText);
      // Append Geolocation to the DOM
      appendLocation(response);
    } else {
      // We reached our target server, but it returned an error
      request.onerror();
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("We reached our target server, but it returned an error.");
  };

  request.send();
}
function appendLocation(location) {
  // Information Variables
  var degree = String.fromCharCode(176),
    city = [location.name, ", ", location.sys.country].join(""),
    icon = location.weather[0].icon,
    description = location.weather[0].main,
    windSpeed = [location.wind.speed, " Knotts"].join(""),
    humidityPercentage = [location.main.humidity, "% Humidity"].join(""),
    weatherC = [Math.floor(location.main.temp), degree, "C"].join(""),
    weatherCMin = [Math.floor(location.main.temp_min), degree, "C"].join(""),
    weatherCMax = [Math.floor(location.main.temp_max), degree, "C"].join(""),
    weatherF = [Math.floor(location.main.temp * 1.8 + 32), degree, "F"].join(
      ""
    ),
    weatherFMin = [
      Math.floor(location.main.temp_min * 1.8 + 32),
      degree,
      "F"
    ].join(""),
    weatherFMax = [
      Math.floor(location.main.temp_max * 1.8 + 32),
      degree,
      "F"
    ].join(""),
    tempDescriptionC = `The current temperature is ${weatherC}<br />The low is ${weatherCMin} and the high is ${weatherCMax}.`,
    tempDescriptionF = `The current temperature is ${weatherF}<br />The low is ${weatherFMin} and the high is ${weatherFMax}.`;

  // append request information to the DOM
  weatherLocation.innerHTML = tempDescriptionC;
  cityLocation.innerHTML = city;
  iconLocation.innerHTML = `Weather Condition: ${description} <img src="${icon}" />`;
  windLocation.innerHTML = windSpeed;
  humidityLocation.innerHTML = humidityPercentage;
  

  // Toggle temperature between Celsius and Fahrenheit
  changeTempLocation.onclick = function() {
    console.log("Clicked");
    var metric = this.classList.toggle("metric");
    if (metric) {
      weatherLocation.innerHTML = tempDescriptionF;
    } else {
      weatherLocation.innerHTML = tempDescriptionC;
    }
  };
}

navigator.geolocation.getCurrentPosition(success, error, options);