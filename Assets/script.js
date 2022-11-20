
const apiKey = "024d7fc6bc6f29f1df64b23b920121d3"
function getWeatherForecast(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            console.log(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`)
        })
        .catch(err => console.error(err));
}


var searchBtn = document.getElementById("searchButton") 
searchBtn.addEventListener("click",function(){
    var city = document.getElementById("cityName").value
    getWeatherForecast(city)
})