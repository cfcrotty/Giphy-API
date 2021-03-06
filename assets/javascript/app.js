// Initial array of gif topics - foods
var topics = ["sushi", "mango", "flowers", "potato", "fruits", "vegetables", "burger", "fries", "rice", "fish"];
var responseGlobal;
var favArray = [];
var oldIdx = "";
var limitNum = 10;
var lat = "";
var long = "";
var city = "San Diego";

//animation
var widthScreen = 0;
var heightScreen = 0;
var back = false;
var back1 = false;
var pxl = 50;
var pxl1 = 20;
theWidth = $(window).width() - 100;
theHeight = $(window).height() - 200;
var animateImage = $(".animateImage");
var animateImage1 = $(".animateImage1");
var animateImage2 = $(".animateImage2");
var animateImage3 = $(".animateImage3");

function isObject(o) {
    return typeof o == "object";
}
// Function for dumping the JSON content for each button into the div
function displayGiphyInfo() {
    if (oldIdx === $(this).attr("data-name")) { limitNum += 10; }
    else { limitNum = 10; oldIdx = $(this).attr("data-name"); }
    var apiKey = "EqXEOnxgbfNZuyVVumjmq59Fasbzofgw";
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + $(this).attr("data-name") + "&limit=" + limitNum;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#lastRow").empty();
        //data is the JSON string
        //$("#lastRow").html(JSON.stringify(response));
        if (response.data.length > 1 && response.pagination.count > 0) {
            responseGlobal = response;
            for (var i = 0; i < response.data.length; i++) {
                var div = $("<div>");
                div.addClass("divGif");
                div.append(`<button class="gifBtn" id="id${i}" name="id${i}" value="${i}"><p>${response.data[i].title}</p><p>Rating: ${response.data[i].rating.toUpperCase()}</p>
            <img id="img${i}" name="img${i}" class="image" src="${response.data[i].images.fixed_height_small_still.url}"></button>
            <p class="pFav"><button class="btn btn-primary addGif" id="fav${i}" name="fav${i}" value="${i}">Add to Favorites</button></p>`);
                $("#lastRow").prepend(div);
                $("#id" + i).click(stillOrGif);
                $("#fav" + i).click(addToFavorites);
                //$("#download"+i).click(downloadGif);<p><a href="${responseGlobal.data[i].images.fixed_height_small.url}" class="addBtn" id="download${i}" name="download${i}" value="${i}" download="${response.data[i].id}.gif">Download</a></p>
            }
        } else {
            $("#lastRow").append(`No result for this topic`);
        }
    });
}
// Function for displaying gif data
function renderButtons() {
    $("#topRow").empty();
    // Looping through the array of Giphy gifs
    for (var i = 0; i < topics.length; i++) {
        // Then dynamicaly generating buttons for each gif in the array
        var a = $("<button>");
        a.addClass("btn btn-secondary GGif");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#topRow").append(a);
    }
}
// This function handles events where one button is clicked
$("#addGif").on("click", function (event) {
    event.preventDefault();
    var giphy = $("#gifInput").val().trim();
    var chk = topics.indexOf(giphy);
    if (giphy && chk < 0) {
        topics.push(giphy);
        renderButtons();
    }
});
//function to change gif url
function stillOrGif() {
    var idx = $(this).val();
    //alert(responseGlobal.data[idx].images.fixed_height_small.url);
    if ($("#img" + idx).attr("src") == responseGlobal.data[idx].images.fixed_height_small.url) {
        $("#img" + idx).attr("src", responseGlobal.data[idx].images.fixed_height_small_still.url);
    } else {
        $("#img" + idx).attr("src", responseGlobal.data[idx].images.fixed_height_small.url);
    }
}
//function to change gif url
function stillOrGif1() {
    var idx = $(this).val();
    //alert(responseGlobal.data[idx].images.fixed_height_small.url);
    if ($("#imgFav" + idx).attr("src") == favArray[idx].images.fixed_height_small.url) {
        $("#imgFav" + idx).attr("src", favArray[idx].images.fixed_height_small_still.url);
    } else {
        $("#imgFav" + idx).attr("src", favArray[idx].images.fixed_height_small.url);
    }
}
//function to show or hide favorite gifs
function showHideFav() {
    if ($("#secondDiv").css('display') == 'none') {
        $("#secondDiv").show();
    } else {
        $("#secondDiv").hide();
    }
}
//function to add favorites
function addToFavorites() {
    var idx = $(this).val();
    var chk = favArray.map(function (e) { return e.id; }).indexOf(responseGlobal.data[idx].id);
    if (chk < 0) {
        favArray.push(responseGlobal.data[idx]);
        localStorage.setItem("gifFavorites", JSON.stringify(favArray));
        displayFavorites();
    }
}
//function display favorites
function displayFavorites() {
    if (localStorage.getItem("gifFavorites")) favArray = Array.from(JSON.parse(localStorage.getItem("gifFavorites")));
    $("#lastRowFav").empty();
    if (favArray.length > 0) {
        for (var i = 0; i < favArray.length; i++) {
            var div = $("<div>");
            div.addClass("divGif");
            div.append(`<button id="idFav${i}" name="idFav${i}" value="${i}" class="gifBtn"><p>${favArray[i].title}</p><p>Rating: ${favArray[i].rating.toUpperCase()}</p><img id="imgFav${i}" name="imgFav${i}" class="image" src="${favArray[i].images.fixed_height_small_still.url}"></button>
            <p class="pFav"><button class="btn btn-primary addGif" id="removeFav${i}" name="removeFav${i}" value="${i}">Remove from Favorites</button>`);
            $("#lastRowFav").prepend(div);
            $("#removeFav" + i).click(removeFromFavorites);
            $("#idFav" + i).click(stillOrGif1);
        }
    } else {
        $("#lastRowFav").text("No favorites");
    }
}
//function to remove gif/objects from favorites
function removeFromFavorites() {
    var idx = $(this).val();
    favArray.splice(idx, 1);
    localStorage.setItem("gifFavorites", JSON.stringify(favArray));
    displayFavorites();
}
//
function downloadGif() {
    var idx = $(this).val();
    alert(idx);
    var image = document.getElementById("iFrameDiv");
    image.src = responseGlobal.data[idx].images.fixed_height_small.url;
    //var downloadingImage = new Image();
    //downloadingImage.onload = function(){
    //    image.src = this.src;   
    //};
    //downloadingImage.src = responseGlobal.data[idx].images.fixed_height_small.url;
}
//function for animation of image
function showHideImages() {
    if (!back1 && theHeight <= heightScreen) {
        back1 = true;
    } else if (heightScreen <= 0) {
        back1 = false;
    }
    if (!back && theWidth <= widthScreen) {
        back = true;
    } else if (widthScreen <= 0) {
        back = false;
    }
    if ($(window).width() < widthScreen || back) {
        widthScreen -= pxl;
        animateImage.animate({ left: "-=" + pxl + "px" }, "normal");
        animateImage1.animate({ left: "+=" + pxl + "px" }, "normal");

    } else if (theWidth > widthScreen || !back) {
        widthScreen += pxl;
        animateImage.animate({ left: "+=" + pxl + "px" }, "normal");
        animateImage1.animate({ left: "-=" + pxl + "px" }, "normal");

    }
    if ($(window).height() < heightScreen || back1) {
        heightScreen -= pxl1;
        animateImage2.animate({ top: "-=" + pxl1 + "px" }, "normal");
        animateImage3.animate({ top: "+=" + pxl1 + "px" }, "normal");

    } else if (theHeight > heightScreen || !back1) {
        heightScreen += pxl1;
        animateImage2.animate({ top: "+=" + pxl1 + "px" }, "normal");
        animateImage3.animate({ top: "-=" + pxl1 + "px" }, "normal");

    }
}
// END - Animation

//START - Weather and Maps
//function to show weather information 
function showWeather() {
    var city1 = getLocation(lat, long);
    if (city1) city = city1;
    var apiKey = "63466a37cf7e65e9cee156d4dc706f3f";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    //alert(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
        $("#insertWeather").empty();
        $("#insertWeather").append(`<h1 class="text-center">${city}</h1>`);
        $("#insertWeather").append("<p class='text-center'>Temperature is <b>" + response.main.temp + " Fahrenheit</b></p>");
        $("#insertWeather").append("<p class='text-center'>Humidity is <b>" + response.main.humidity + "%</b></p>");
        $("#insertWeather").append("<p class='text-center'>There wil be <b>" + response.weather[0].description + "</b></p>");
    });
    $(".fullBack").show();
    $(".fullImage").show();
}
//function to get city by longitude and longitude
function getLatLong() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            long = position.coords.longitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
//function to get City
function getLocation(lat, long) {
    var geocoder = new google.maps.Geocoder;
    var latlng = { lat: parseFloat(lat), lng: parseFloat(long) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                //console.log(results[0]);
                //console.log(results[0].address_component[3].long_name);
                return results[0].address_components[3].long_name;
            } else {
                window.alert('No results found');
                return 0;
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
            return 0;
        }
    });
}
//set map on page load
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 32.9959883, lng: -117.0825605 }
        //("32.9959883","-117.0825605");
    });
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    document.getElementById('weather').addEventListener('click', function () {
        geocodeLatLng(geocoder, map, infowindow);
    });

}
//function to set pin of location on map
function geocodeLatLng(geocoder, map, infowindow) {
    var latlng = { lat: parseFloat(lat), lng: parseFloat(long) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
                console.log(results[0]);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
//END - Weather and Maps

$("#weather").on("click", showWeather);
$("#showFav").on("click", showHideFav);
//hide div for about game
$("#close").on("click", function () {
    $(".fullBack, .fullImage, .fullImage1").hide();
});
// Generic function for displaying the GiphyInfo
$(document).on("click", ".GGif", displayGiphyInfo);
renderButtons();
displayFavorites();
$(document).ready(function () {
    getLatLong();
    intervalIdAnimate = setInterval(showHideImages, 1);
});