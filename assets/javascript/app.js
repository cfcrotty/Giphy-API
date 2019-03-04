// Initial array of gif topics
var topics = ["flowers","nature","trees","beach","animals","fruits"];
var responseGlobal;

//animation
var widthScreen = 0;
var heightScreen = 0;
var back = false;
var back1 = false;
var pxl = 50;
var pxl1 = 20;
theWidth = $(window).width()-100;
theHeight = $(window).height()-200;
var animateImage = $(".animateImage");
var animateImage1 = $(".animateImage1");
var animateImage2 = $(".animateImage2");
var animateImage3 = $(".animateImage3");

function isObject(o) {
  return typeof o == "object";
}
// Function for dumping the JSON content for each button into the div
function displayGiphyInfo() {
    var apiKey = "EqXEOnxgbfNZuyVVumjmq59Fasbzofgw";
    var queryURL = "http://api.giphy.com/v1/gifs/search?api_key="+apiKey+"&q=" + $(this).attr("data-name") + "&limit=10"
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    $("#lastRow").empty();
    //data is the JSON string
    //$("#lastRow").html(JSON.stringify(response));
    responseGlobal=response;
    for (var i=0;i<response.data.length;i++) {
        $("#lastRow").append(`<button id="id${i}" id="id${i}" value="${i}"><img id="img${i}" name="img${i}" class="image" src="${response.data[i].images.fixed_height_small_still.url}"></button>`);
        $("#id"+i).click(stillOrGif);
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
    a.addClass("GGif");
    a.attr("data-name", topics[i]);
    a.text(topics[i]);
    $("#topRow").append(a);
  }
}
// This function handles events where one button is clicked
$("#addGif").on("click", function(event) {
  event.preventDefault();
  var giphy = $("#gifInput").val().trim();
  topics.push(giphy);
  renderButtons();
});
function stillOrGif() {
    var idx = $(this).val();
    //alert(responseGlobal.data[idx].images.fixed_height_small.url);
    if ($("#img"+idx).attr("src")==responseGlobal.data[idx].images.fixed_height_small.url) {
        $("#img"+idx).attr("src",responseGlobal.data[idx].images.fixed_height_small_still.url);
    } else {
        $("#img"+idx).attr("src",responseGlobal.data[idx].images.fixed_height_small.url);
    }
}
// Generic function for displaying the GiphyInfo
$(document).on("click", ".GGif", displayGiphyInfo);
renderButtons();

//function for animation of image
function showHideImages() {
    if (!back1 && theHeight <= heightScreen) {
        back1 = true;
    } else if (heightScreen<=0) {
        back1 = false;
    }
    if (!back && theWidth <= widthScreen) {
        back = true;
    } else if (widthScreen<=0) {
        back = false;
    }
    if ($(window).width() < widthScreen || back) {
        widthScreen-=pxl;
        animateImage.animate({ left: "-="+pxl+"px" }, "normal");
        animateImage1.animate({ left: "+="+pxl+"px" }, "normal");
        
    } else if (theWidth > widthScreen || !back) {
        widthScreen+=pxl;
        animateImage.animate({ left: "+="+pxl+"px" }, "normal");
        animateImage1.animate({ left: "-="+pxl+"px" }, "normal");
        
    }
    if ($(window).height() < heightScreen || back1) {
        heightScreen-=pxl1;
        animateImage2.animate({ top: "-="+pxl1+"px" }, "normal");
        animateImage3.animate({ top: "+="+pxl1+"px" }, "normal");
        
    } else if (theHeight > heightScreen || !back1) {
        heightScreen+=pxl1;
        animateImage2.animate({ top: "+="+pxl1+"px" }, "normal");
        animateImage3.animate({ top: "-="+pxl1+"px" }, "normal");
        
    }
}
$(document).ready(function() {
    intervalIdAnimate = setInterval(showHideImages, 1);
});