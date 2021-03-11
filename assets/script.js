// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


// DOM SELECTORS
const searchBtn = document.querySelector("#seachBtn")


// Application Variables
const apiKey = "2774fecb2ab2cf87eadd45accf53f81e";
const currentDay = '';
const fiveDay = '';
const history = ['Philadelphia', 'New York', "Austin"];

// Done on Page Load: pull buttons from local storage, add event listener to the search button


// Event handlers: event handler for search button, collective event handler for search list history

// API Calls: Search for current weather by city name; search for forecast by Lat & Lon
function getCurrentWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then(console.log)
    .then(success => currentDay = success);
}

function getFiveDayWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then(console.log)
    .then(success => fiveDay = success);
}

// Update View: Generates HTML that populates page, Function for history, function for current weather section, function for 5-day forecast
function searchHistory () {
  if (history){
    const historyCard = document.getElementById('history-card');
    for (let i = 0; i < history.length; i++) {
      const childElement = document.createElement('div');
      const appendChildElement = historyCard.appendChild(childElement)
      appendChildElement.innerHTML = history[i];
      console.log(history[i])
    }
  }
}

localStorage.setItem("items",JSON.stringify([...history]));


//  Data management: function that puts data into local storage, second function that reads data from local storage

// EVENT LISTENERS
function searchClick() {
  console.log('reach search click');
  const input = document.querySelector("nav input");
  const city = input.value.trim();
  if (city) {
    getCurrentWeather(city);
    getFiveDayWeather(city);
    searchHistory();
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  for (let i = 0; i < localStorage.items.length; i++) {
    const cityList = document.getElementById('history-card');
    document.getElementById("search" + i).innerHTML = localStorage.items[i];
    console.log(localStorage.items[0]); 
  }
}) 