var cityInput = document.querySelector('#city-input');
var cityName = document.querySelector('#city-name');
var searchBtn = document.querySelector('#search-btn');
var cityArray = [];


// $('#searched-cities')

// API Key
var apiKey = 'd2069fb92aa01792842b8a289a984175';

// To obtain data from input form
var filledForm = function (event) {
    
    // To format city name so it can be searched
    var citySelected = cityInput
        .value
        .trim()
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    
    // To get coordinates from typed city so it can be verified
    if (citySelected) {
        getCoordinates(citySelected);
        cityInput.value = '';
    // If coordinates couldn't be obtained by name of the city, user must be asked to type the city again
    } else {
        alert('Please fill the form with a city :)');
    };
};

// Function to get coordinates
var getCoordinates = function(city) {
    var WeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(WeatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                CityForecast(city, lon, lat);
                if (document.querySelector('city-list')) {
                    document.querySelector('city-list').remove();
                }
                savedCity(city);
                loadedCities();
            });
        } else {
            alert('Error:${response.statusText}')
        }
    })
        .catch(function (error) {
            alert('Weather loading is unavailable.');
        })
}

// Display (fetch) current weather and 5-day forecast using latitud and longitud
var CityForecast = function (city, lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                cityName.textContent = `${city} (${moment().format("M/D/YYYY")})`;
                // console.log(data)
                TodaysForecast(data);
                FiveDaysForecast(data);
            });
        }
    })
}

var displayTemperature = function(element, temperature) {
    var temperatureEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    temperatureEl.textContent = elementText;
}

var TodaysForecast = function(forecast) {
    
    var forecastEl = document.querySelector('.today-forecast');
    forecastEl.classList.remove('hide');

    var weathericonEl = document.querySelector('#icon-0');
    var currentIcon  = forecast.current.weather[0].icon;
    weathericonEl.setAttribute('src', 'https://openweathermap.org/img/wn/${currentIcon}.png');
    weathericonEl.setAttribute('alt', forecast.current.weather[0].main)

    displayTemperature('#temp-0', forecast.current['temp']);

    var wind0El = document.querySelector('#wind-0');
    wind0El.textContent = forecast.current['wind_speed'];

    var humidity0El = document.querySelector('#humidity-0');
    humidity0El.textContent = forecast.current['humidity'];

    var UVindexEl = document.querySelector('#UVindex-0');
    var UVindex0 = forecast.current['uvi'];
    UVindexEl.textContent =  UVindex0;

    switch(true){
        case (UVindex0 <= 2):
            UVindexEl.className = 'badge badge-success';
            break;
            case (UVindex0 <= 5):
                UVindexEl.className = 'badge badge-warning';
                break;
                case (UVindex0 <= 7):
                    UVindexEl.className = 'badge badge-danger';
                    break;
                    default:
                        UVindexEl.className = 'badge text-light';
                        UVindexEl.setAttribute('style', 'background-color: #553C7B');
    }
}

var FiveDaysForecast = function(forecast){
    for (var i = 1; i <6; i++){
       
        var date = document.querySelector('#day-' + i);
        date.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImage = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImage.setAttribute('src', 'http://openweathermap.org/img/wn/${iconCode}.png');
        iconImage.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemperature('#temp-' + i, forecast.daily[i].temp.day);

        var windSpan = document.querySelector('#wind-' + i);
        windSpan.textContent = forecast.daily[i].wind;

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;

    }
}

// To save cities in local storage
var savedCity = function(city){
    for (var i = 0; i < cityArray.length; i++){
        if (city === cityArray[i]) {
            cityArray.splice(i, 1);
        }
    }
    // Send city to localstorage
    cityArray.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArray));
}

// Load cities from localstorage
var loadedCities = function (){
    cityArray = JSON.parse(localStorage.getItem('cities'));

    if (!cityArray) {
        cityArray = [];
        return false;
        // to determine limit of saved items (≤10)
    } else if (cityArray.length>10){
        cityArray.shift();
    }

    var searchedCities = document.querySelector('#searched-cities');
    var listedCitiesUl = document.createElement('ul');
    listedCitiesUl.className = 'list-group list-group-flush city-list';
    searchedCities.appendChild(listedCitiesUl);

    for (var i = 0; i < cityArray.length; i++){
        var cityListItems = document.createElement('button');
        cityListItems.setAttribute('type', 'button');
        cityListItems.className = 'list-group-item';
        cityListItems.setAttribute('value', cityArray[i]);
        cityListItems.textContent = cityArray[i];
        listedCitiesUl.prepend(cityListItems);
    }

    var citiesList = document.querySelector('.city-list');
    citiesList.addEventListener('click', selectRecentCities)

}

var selectRecentCities = function(event){
    var clickedCity = event.target.getAttribute('value');
    getCoordinates(clickedCity);
}

loadedCities();
searchBtn.addEventListener('click', filledForm)


// City search after click
cityInput.addEventListener('keyup', function(event){
    if (event.keyCode === 13){
        searchBtn.click();
    }
});

// $(document).ready(function(){
//     $('.search-btn').on('click', function(){

//     })
// })

// API Key obtained by registration in https://home.openweathermap.org/api_keys
//      https://api.openweathermap.org/data/2.5/weather?q=
//      d7c001f7f30341bee5248ef42b77ab57