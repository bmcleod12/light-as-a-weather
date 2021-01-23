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

    // assigns a listener to each list item and tells it to move that city to the front of the arry and place that city in the search bar before calling the api
    $(document).on("click", "li", function (event) {
        event.preventDefault();
        $("#search-city").val(this.innerHTML);
        console.log(cityList.indexOf(this.innerHTML));
        if (cityList.indexOf(this.innerHTML) > 0) {
            cityList.splice(cityList.indexOf(this.innerHTML), 1);
            cityList.unshift(this.innerHTML);
        }
        callAPI();
    });

    // clears the city list and refreshes the page
    $("#clearSearch").on("click", function(event) {
        event.preventDefault();
        window.localStorage.clear();
        location.reload();
    });
        
    function callAPI() {
        // grabs the searched city term
        var q = $("#search-city").val();
        
        $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + q + "&units=imperial" + "&appid=c8dda36408a8eec1bd2b3381270f38a9",
        method: "GET",
        // presents user with an error if they don't search a real city/if it has typos/etc
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                alert("No cities were found that match your search. Please try again.");
            }
        }
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

                    // 5 day forecast element creation. loops through days 1-5 in the response array and creates a card for each with the day and data
                    for(var i = 1; i < 6; i++) {
                        
                        var futureWeather = $("<p>").text(response.daily[i].weather[0].main).append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png").attr("width","35px").attr("height", "35px"));
                        var futureTemp = $("<p>").text("Temp: " + response.daily[i].temp.day + "°F");
                        var futureHumidity = $("<p>").text("Humidity: " + response.daily[i].humidity + "%"); 

                        // gets the date for the next 5 days
                        var fullDate = new Date()       
                        var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
                        var nextDay = twoDigitMonth + "/" + (fullDate.getDate()+i) + "/" + fullDate.getFullYear();

                        $("#forecast-wrapper").append($("<div>").addClass("col-auto").
                            append($("<div>").addClass("card mb-4").
                            append($("<h5>").addClass("card-header bg-info").css("color", "white").text(nextDay)).
                            append($("<div>").addClass("card-body").append(futureWeather, futureTemp, futureHumidity))));
                    }
                });
        });
    };

    // stores the cities for later
    function storeCityList() {
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }

    // displays the search city list in the left panel
    function renderCityList() {
        // clears the left panel before creating an element for each object in the cityList array
        $("#searched-cities").empty();

        // loops through cities that have been searched and makes the first city in the list a darker green
        for (var i = 0; i < cityList.length; i++) {
            var city = cityList[i];
            var searchedCity = $("<li>").attr("id", i + "-storedCity").addClass("list-group-item list-group-item-action list-group-item-success").text(city);
            $("#0-storedCity").addClass("active");
            $("#searched-cities").append(searchedCity);
            
        }
    }

    // looks for city list in storage and presents the current date on screen
    function init() {
        var storedCityList = JSON.parse(localStorage.getItem("cityList"));
        if (storedCityList !== null) {
            cityList = storedCityList;
        }

        renderCityList();

        var fullDate = new Date()       
        //convert month to 2 digits
        var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);
        var currentDate = twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear();
        $("#current-date").text(currentDate);

    }

    // runs the init function upon page load
    init();

});