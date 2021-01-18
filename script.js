$(document).ready(function(){

    $("#search").on("click", function(event) {
        event.preventDefault();

        var q = $("#search-city").val();
        console.log(q);

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + q + "&units=imperial" + "&appid=c8dda36408a8eec1bd2b3381270f38a9";

        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
            console.log(response.city.name);
            console.log(response.list[0].main.temp);
            console.log(response.list[0].main.humidity);
            console.log(response.list[0].weather[0].icon);
            console.log(response.list[0].weather[0].main);
        });
        
    });


});


// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


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