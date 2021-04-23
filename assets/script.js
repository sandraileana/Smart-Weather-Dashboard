// API Key
var apiKey = 'd7c001f7f30341bee5248ef42b77ab57';

// var cityInput = $('#city-input')
// $('#search-btn')
// $('#searched-cities')
// $('city-name')

// To obtain data from input form

var filledForm = function(event) {
    // To format city name so it can be searched
    var citySelected = $('#city-input')
        .value
        .trim()
        .toLoweCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    if(citySelected){
        getCoordinates(citySelected);
        $('#city-input').value='';
    } else {
        alert('Please fill the form with a city :)');
    }; 
};

var getCoordinates = function(city){
    var WeatherApi = 'https://api.openweathermap.org/data/2.5/weather?q=$(city)&units=imperial&appid=${apiKey}';
    fetch(WeatherApi).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                CityForecast(city, lon, lat);
                if (document.querySelector('city-list')){
                    document.querySelector('city-list').remove();
                }
                saveCity(city);
                loadCities();
            });
        } else{
            alert('Error:${response.statusText}')
        }
    })
    .catch(function (error) {
        alert('Weather loading is unavailable.');
    })
}

// Display (fetch) current weather and 5-day forecast using latitud and longitud

var CityForecast = function(city, lon, lat){
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
            $('city-name').textContent = '${city} (${moment().format("M/D/YYYY")})';
            console.log(data)
            TodaysForecast(data);
            FiveDayForecast(data);
            });
        }
    })
}

$(document).ready(function(){
    $('.search-btn').on('click', function(){

    })
})


// https://api.openweathermap.org/data/2.5/weather?q=
// d7c001f7f30341bee5248ef42b77ab57