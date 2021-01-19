$(document).ready(function(){

    $("#search-city").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    }});

    $("#search").on("click", function(event) {
        event.preventDefault();

        var q = $("#search-city").val();
        console.log(q);

        // var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + q + "&units=imperial" + "&appid=c8dda36408a8eec1bd2b3381270f38a9";

        $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + q + "&units=imperial" + "&appid=c8dda36408a8eec1bd2b3381270f38a9",
        method: "GET"
        }).then(function(response) {

            var latitude = response.city.coord.lat;
            var longitude = response.city.coord.lon;

            // console logs to double check
            // console.log(response);
            // console.log(response.city.name);
            // console.log("Latitude: " + latitude);
            // console.log("Longitude: " + longitude);
            // console.log(response.list[0].main.temp);
            // console.log(response.list[0].main.humidity);
            // console.log(response.list[0].weather[0].icon);
            // console.log(response.list[0].weather[0].main);

            
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=c8dda36408a8eec1bd2b3381270f38a9",
                method: "GET"
                }).then(function(response) { 
                    console.log(response);

                    // var currentHumidity = 
                    console.log("Humidity: " + response.current.humidity);
                    console.log("Current Temperature: " + response.current.temp);
                    console.log("UV Index: " + response.current.uvi);
                    console.log("Wind Speed: " + response.current.wind_speed);
                    console.log("Current Description: " + response.current.weather[0].main);
                    console.log("Icon ID: " + response.current.weather[0].icon);


                    // after I grab the data, create everything for the Current card and append to #current-weather-card

                    // <img src="http://openweathermap.org/img/wn/13n@2x.png" width="50px" height="50px" alt=""></img>
                    // "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
                });



        });
        
    });


});


// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}


// $("#select-artist").on("click", function(event) {
//     // Preventing the button from trying to submit the form
//     event.preventDefault();
//     // Storing the artist name
//     var inputArtist = $("#artist-input").val().trim();

//     // Running the searchBandsInTown function(passing in the artist as an argument)
//     searchBandsInTown(inputArtist);
//   });

// Searches for city with api key listed below

// extra key for current weather
// b49a7ab043699d21844dd636541d9d32