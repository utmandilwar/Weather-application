// include necessary modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

//create an express app
const app = express();

//Use body-parser middleware
app.use(bodyParser.urlencoded({extended: true}));

//Serve the html file on the root path
app.get("/", function (req, res)
{
    res.sendFile(__dirname + "/index.html");
    
});

//handle post request for weather data
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = "c35181b1bbf5faa104d6ba76fde637b8";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey + "&q=" + query + "&units=" + unit;

    https.get(url, function (response) {
        let data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            try {
                const weatherData = JSON.parse(data);
                console.log("Received weather data:", weatherData);

                if (weatherData.list && Array.isArray(weatherData.list) && weatherData.list.length > 0) {
                    const temp = weatherData.list[0].main.temp;
                    const weatherDescription = weatherData.list[0].weather[0].description;
                    const icon = weatherData.list[0].weather[0].icon;
                    const imageURL = "https://openweathermap.org/img/wn/" + icon + ".png";

                    res.write("<p>The weather is currently " + weatherDescription + "</p>");
                    res.write("<h1>The temperature in " + query + " is " + temp + " degree Celsius.</h1>");
                    res.write("<img src='" + imageURL + "'>");
                    res.send();
                } else {
                    console.log("No valid weather data found.");
                    res.send("Unable to retrieve weather data. Please check the city name.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.send("Error fetching weather data");
            }
        });
    });
});









// Start the server on port 3000
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
