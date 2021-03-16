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
const urlIcon1 = "http://openweathermap.org/img/wn/"; 
const urlIcon2 = "@2x.png"; 

// DOM SELECTORS
const searchBtn = document.querySelector("#seachBtn")


// Application Variables
const apiKey = "2774fecb2ab2cf87eadd45accf53f81e";
var fiveDay;
let history = [];

// Done on Page Load: pull buttons from local storage, add event listener to the search button
function currentDay() {
  $("#currentDay").text(moment().format("MMMM Do, YYYY"));
}

currentDay();

// Event handlers: event handler for search button, collective event handler for search list history

// API Calls: Search for current weather by city name; search for forecast by Lat & Lon
function getCurrentWeather(city) {
  
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=imperial`
  )
    .then((res) => res.json())
    .then(data => {
      console.log(data)
      const cityName = document.getElementById('current-city-title')
      const cityTemp = document.getElementById('current-city-temp')
      const cityHumidity = document.getElementById('current-city-humidity')
      const cityWindSpeed = document.getElementById('current-city-wind-speed')
      const cityUvIndex = document.getElementById('current-city-uv-index')
      cityName.innerHTML = data.name 
      cityTemp.innerHTML = `Temp: ${data.main.temp}°F`
      cityHumidity.innerHTML = `Humidity: ${data.main.humidity}%` 
      cityWindSpeed.innerHTML = `Wind Speed: ${data.wind.speed}MPH`;
      cityUvIndex.innerHTML = `UV Index:`
      currentDay();
    })
}

function getFiveDayWeather(city) {

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then( function(d){
      $("#forecast-container").html(""); 
      for (let i=0;i<5;i++){
        drawForecastCard(d.list[i*8]);
      }
      console.log(d); 
    })
    .then(success => fiveDay = success);
}

// Update View: Generates HTML that populates page, Function for history, function for current weather section, function for 5-day forecast
function searchHistory () {
  const data = JSON.parse(localStorage.getItem('cities'))
  if (data){
    let historyCard = $('#history-card');
    for (let i = 0; i < 5; i++) {
      let childElement =$('<div>');
      childElement.attr("id", "history"+i);
      childElement.text(data[i]);
      childElement.click( ()=> $("#search").val($("#history"+i).text()) ); 
 
      historyCard.append(childElement)
     
    }

  }
}


function drawForecastCard(data){
  let content = $("<div>").html(`<div class="forecast-card">
  <h4 class="forecast-card-date">${moment(data.dt_txt, "YYYY-MM-DD hh:mm:ss").format("MMM Do YY")}</h4>
  <img class="fas fa-sun" src=${urlIcon1 + data.weather[0].icon + urlIcon2}></img>
  <p class="forecast-card-temp">Temp: ${((data.main.temp-273)*1.8+32).toFixed(2)}</p>
  <p class="forecast-card-humidity">Humidity: ${data.main.humidity}</p>
</div>`)
  $("#forecast-container").append(content);
}
//  Data management: function that puts data into local storage, second function that reads data from local storage

// EVENT LISTENERS
function searchClick() {
  console.log('reach search click');
  const data = JSON.parse(localStorage.getItem('cities'))
  var input = document.querySelector("nav input");
  console.log(input)
  var city = input.value.trim();
  if (city) {
  history.push(city)
  localStorage.setItem('cities', JSON.stringify([...new Set([...history, ...data])]))

  let element = document.getElementById("history-card");
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
    getCurrentWeather(city);
    getFiveDayWeather(city);
    searchHistory();
}
}

document.addEventListener('DOMContentLoaded', function() {
  if(!localStorage.cities) {
    localStorage.setItem('cities', JSON.stringify([]))
  }
  searchHistory()
});
