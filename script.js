var cityList = [];

$(document).ready(function(){

    // Prevents the enter key from submitting the form and allows it to call the API
    $("#search-city").keydown(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        callAPI();
    }});

    // Listens for the click on the search icon and calls the API
    $("#search").on("click", function(event) {
        event.preventDefault();
        callAPI();
    });
        
    function callAPI() {

        // grabs the searched city term
        var q = $("#search-city").val();
        
        $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + q + "&units=imperial" + "&appid=c8dda36408a8eec1bd2b3381270f38a9",
        method: "GET"
        }).then(function(response) {
         
            // grabs latitude and longitude for use the next API call; create cityName so Capitalization is corrected if incorrect in the search
            var latitude = response.city.coord.lat;
            var longitude = response.city.coord.lon;
            var cityName = response.city.name;

            // adds cityName to the cityList array
            cityList.push(cityName);
            
            // clears search input
            $("#search-city").val("");
            
            renderCityList();

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=c8dda36408a8eec1bd2b3381270f38a9",
                method: "GET"
                }).then(function(response) { 

                    // references HTML IDs to display API data on screen
                    $("#current-city-header").text(cityName+ ", " + response.current.weather[0].main).append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png").attr("width","60px").attr("height", "60px"));
                    $("#current-temp").text(response.current.temp);
                    $("#current-humidity").text(response.current.humidity);
                    $("#current-wind-speed").text(response.current.wind_speed);
                    
                    // declares UV Index as a variable for easy reference below
                    var currentUVIndex = response.current.uvi;

                    // checks if current UV Index is 0-2, 3-5, 6-7, 8-10, or 11+; based on EPA's UV Index scale: https://www.epa.gov/sunsafety/uv-index-scale-0
                    if(currentUVIndex < 3) {
                        $("#uv-index").addClass("badge bg-success").text(currentUVIndex);
                    }

                    if(currentUVIndex >= 3 && currentUVIndex < 6) {
                        $("#uv-index").addClass("badge bg-warning").text(currentUVIndex);
                    }
                    
                    if(currentUVIndex >= 6 && currentUVIndex < 8) {
                        $("#uv-index").addClass("badge").css("background-color", "rgb(247, 112, 1)").text(currentUVIndex);
                    }

                    if(currentUVIndex >= 8 && currentUVIndex < 11) {
                        $("#uv-index").addClass("badge bg-danger").text(currentUVIndex);
                    }
          
                    if(currentUVIndex > 11) {
                        $("#uv-index").addClass("badge").css("background-color", "purple").text(currentUVIndex);
                    }
                });
        });
    };


    function renderCityList() {

        // clears the left panel before creating an element for each object in the cityList array
        $("#searched-cities").empty();

        for (var i = 0; i < cityList.length; i++) {

            var city = cityList[i];

            var searchedCity = $("<li>").text(city);

            $("#searched-cities").append(searchedCity);
            
        }
    }


});

// CONSOLE LOGS FOR THE DATA CALL
            // console logs to double check
            // console.log(response);
            // console.log(response.city.name);
            // console.log("Latitude: " + latitude);
            // console.log("Longitude: " + longitude);
            // console.log(response.list[0].main.temp);
            // console.log(response.list[0].main.humidity);
            // console.log(response.list[0].weather[0].icon);
            // console.log(response.list[0].weather[0].main);

// CONSOLE LOGS FOR THE ONE CALL
            // var currentHumidity = 
            // console.log("Humidity: " + response.current.humidity);
            // console.log("Current Temperature: " + response.current.temp);
            // console.log("UV Index: " + response.current.uvi);
            // console.log("Wind Speed: " + response.current.wind_speed);
            // console.log("Current Description: " + response.current.weather[0].main);
            // console.log("Icon ID: " + response.current.weather[0].icon);
