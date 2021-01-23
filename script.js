var cityList = [];

$(document).ready(function(){

    init();

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

    // clears the city list and refreshes the page
    $("#clearSearch").on("click", function(event) {
        event.preventDefault();
        window.localStorage.clear();
        location.reload();
    });

    // this only works for one click
    $("li").on("click", function (event) {
            event.preventDefault();
            // console.log("clicked");
            $("#search-city").val(this.innerHTML);
            callAPI();
            // location.reload();
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

            // adds cityName to the cityList array only if it doesn't already exist in the array
            if (cityList.includes(cityName) === false) cityList.unshift(cityName);
            
            // clears search input
            $("#search-city").val("");
            
            storeCityList();
            renderCityList();

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=c8dda36408a8eec1bd2b3381270f38a9",
                method: "GET"
                }).then(function(response) { 
                    console.log(response);
                    $("#forecast-wrapper").empty();

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

                    // 5 day forecast element creation

                    for(var i = 1; i < 6; i++) {
                        

                        var futureWeather = $("<p>").text(response.daily[i].weather[0].main).append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png").attr("width","35px").attr("height", "35px"));
                        var futureTemp = $("<p>").text("Temp: " + response.daily[i].temp.day + "°F");
                        var futureHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%"); 

                        $("#forecast-wrapper").append($("<div>").addClass("col-auto").
                            append($("<div>").addClass("card mb-4").
                            append($("<h5>").addClass("card-header bg-info").css("color", "white").text("Day " + i)).
                            append($("<div>").addClass("card-body").append(futureWeather, futureTemp, futureHumidity))));
                    }

                });
        });
    };

    function init() {
        var storedCityList = JSON.parse(localStorage.getItem("cityList"));
        console.log("init: " + storedCityList);

        if (storedCityList !== null) {
            cityList = storedCityList;
        }

        renderCityList();

        // stopped here for now
        var fullDate = new Date()
        console.log(fullDate);
         
        //convert month to 2 digits
        var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
         
        var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
        console.log(currentDate);
        //19/05/2011

    }

    function storeCityList() {
        localStorage.setItem("cityList", JSON.stringify(cityList));
        console.log("local storage: " + cityList);
    }

    function renderCityList() {
        // clears the left panel before creating an element for each object in the cityList array
        $("#searched-cities").empty();

        for (var i = 0; i < cityList.length; i++) {

            var city = cityList[i];

            var searchedCity = $("<li>").attr("id", i + "-storedCity").addClass("list-group-item list-group-item-action list-group-item-success").text(city);

            $("#0-storedCity").addClass("active");

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
            // console.log(response.daily[1].temp.day);
            // console.log(response.daily[1].humidity);
            // console.log(response.daily[1].weather[0].main);
            // console.log(response.daily[1].weather[0].icon);