$(document).ready(function () {

    
    const apiKey = '024d7fc6bc6f29f1df64b23b920121d3';


    const picIconEl = $('img#weather-icon');
    const temperatureEl = $('span#temperature');
    const currentcityEl = $('h2#city');
    const currentdateEl = $('h3#date');
    const humidEl = $('span#humidity');
    const cityListEl = $('div.cityList');
    const windEl = $('span#wind');
   const cityChoice = $('#city-choice');

   // Store past searched cities
   let previousCities = [];


    // pull from local storage
    function generateCities() {
        const storedCities = JSON.parse(localStorage.getItem('previousCities'));
        if (storedCities) {
            previousCities = storedCities;
        }
    }

    // Store in local storage
    function storeCities() {
        localStorage.setItem('previousCities', JSON.stringify(previousCities));
    }

       //place cities in aplhabetical order
   function compare(a, b) {
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();
     let comparison = 0;
    if (cityA > cityB) {
        comparison = 1;
    } else if (cityA < cityB) {
        comparison = -1;
    }
    return comparison;
}
   
 
    function buildURLFromInputs(city) {
        if (city) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        }
    }
    function buildURLFromId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    // previous searches
     function displayCities(previousCities) {
        cityListEl.empty();
        previousCities.splice(5);
        let sortedCities = [...previousCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location) {
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListEl.append(cityDiv);
        });
    }
    
    // call the OpenWeather API
    function searchWeather(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

    // Store current city in past cities
    let city = response.name;
    let id = response.id;
        if (previousCities[0]) {
            previousCities = $.grep(previousCities, function (storedCity) {
        return id !== storedCity.id;
        })
    }
    previousCities.unshift({ city, id });
    storeCities();
    displayCities(previousCities);
            
    // current weather 
    currentcityEl.text(response.name);
    let formattedDate = moment.unix(response.dt).format('L');
    currentdateEl.text(formattedDate);
    let weatherIcon = response.weather[0].icon;
    picIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
    temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
    humidEl.text(response.main.humidity);
    windEl.text((response.wind.speed * 2.237).toFixed(1));

    // search button
    $('#search-btn').on('click', function (event) {
        event.preventDefault();
        let city = cityChoice.val().trim();
        city = city.replace(' ', '%20');
        cityChoice.val('');
        if (city) {
            let queryURL = buildURLFromInputs(city);
            searchWeather(queryURL);
        }
    }); 

//  5 day forecast
let lat = response.coord.lat;
let lon = response.coord.lon;
let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
$.ajax({
    url: queryURLAll,
    method: 'GET'
}).then(function (response) {
    
    let fiveDay = response.daily;

  
    for (let i = 0; i <= 5; i++) {
        let currDay = fiveDay[i];
        $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
        $(`div.day-${i} .fiveDay-img`).attr(
            'src',
            `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
        ).attr('alt', currDay.weather[0].description);
        $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
        $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
    }
});
});
}

    // sidenave buttons which return the weather
    $(document).on("click", "button.city-btn", function (event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(previousCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildURLFromId(foundCity[0].id)
        searchWeather(queryURL);
    });

     // Function to display the last searched city
     function displayLastSearchedCity() {
        if (previousCities[0]) {
            let queryURL = buildURLFromId(previousCities[0].id);
            searchWeather(queryURL);
        } else {
            let queryURL = buildURLFromInputs("Miami");
            searchWeather(queryURL);
        }
    }
 
    displayLastSearchedCity();

    //  local storage 
    generateCities();
    displayCities(previousCities);  
});