const options = {
    method: 'GET',
    headers: {
        APIKey: "024d7fc6bc6f29f1df64b23b920121d3"

    }
};

fetch('https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid')
.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
