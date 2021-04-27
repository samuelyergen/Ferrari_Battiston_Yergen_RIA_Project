
//canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//background canvas
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    "use strict";
	bgReady = true;
};
bgImage.src = "../site/ressources/images/mockup.png";