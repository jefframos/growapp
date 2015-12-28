/*jshint undef:false */
function pointDistance(x, y, x0, y0){
	return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function degreesToRadians(deg) {
	return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
	return rad / (Math.PI / 180);
}

function scaleConverter(current, max, _scale, object) {
	// console.log(current, max, scale);
	var scale = (max * _scale) / current;

    if(!object){
        return scale;
    }
    if(object.scale){
        object.scale.x = object.scale.y = scale;
    }else if(object.getContent() && object.getContent().scale){
        object.getContent().scale.x = object.getContent().scale.y = scale;
    }
    return scale;
}
function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function testMobile() {
    var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}
var gameView = document.getElementById('game');

var windowWidth = possibleFullscreen()?screen.width:window.innerWidth;// * 2;//750,
windowHeight = possibleFullscreen()?screen.height:window.innerHeight;// * 2;//1334;

var renderer;
var windowWidthVar = screen.width;
windowHeightVar = screen.height;
var retina = 1.5;
console.log(gameView);
var renderer = PIXI.autoDetectRecommendedRenderer(windowWidth, windowHeight, {antialias:true, resolution:retina, view:gameView});
// document.body.appendChild(renderer.view);

var APP;
APP = new Application();
APP.build();
var first = false;
var orientation = "PORTAIT"
function update() {
	requestAnimFrame(update );
	if(!first){
		var tempRation =  orientation === "PORTAIT" ?(window.innerHeight/windowHeight):(window.innerWidth/windowWidth);
		var ratio = tempRation;
		windowWidthVar = windowWidth * ratio;
		windowHeightVar = windowHeight * ratio;
		renderer.view.style.width = windowWidthVar+'px';
		renderer.view.style.height = windowHeightVar+'px';
		// first = true;
	}
	APP.update();
	renderer.render(APP.stage);
}

var initialize = function(){
	// //inicia o game e da um build
	// PIXI.BaseTexture.SCALE_MODE = 2;
	requestAnimFrame(update);
};

(function () {
	var App = {
		init: function () {
			initialize();
		}
	};
	$(App.init);
})();

function initADMOB(){
	if(!window.cordova){
	  		return;
	  	}

			var admobid = {};
			if( /(android)/i.test(navigator.userAgent) ) {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/8419773176',
					interstitial: 'ca-app-pub-9306461054994106/9896506375',
				};
			} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/3989573573',
					interstitial: 'ca-app-pub-9306461054994106/5466306778',
				};
			} else {
				admobid = {
					banner: 'ca-app-pub-9306461054994106/2770192371',
					interstitial: 'ca-app-pub-9306461054994106/4246925578',
				};
			}
			if(AdMob){
				AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
				AdMob.createBanner( {adId: admobid.banner,position: AdMob.AD_POSITION.BOTTOM_CENTER,autoShow: true,adSize:AdMob.AD_SIZE.FULL_BANNER} );
				document.addEventListener('onAdLoaded', function(data){});
		        document.addEventListener('onAdPresent', function(data){});
		        document.addEventListener('onAdLeaveApp', function(data){});
		        document.addEventListener('onAdDismiss', function(data){});
			}
		
}

function possibleFullscreen(){
	if(!testMobile()){
		return false
	}
	var elem = gameView;
	return  elem.requestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullScreen || elem.webkitRequestFullscreen;
}
var isfull = false;
function fullscreen(){
	if(isfull){
		return;
	}
	var elem = gameView;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	}

	// updateResolution(screenOrientation, gameScale);

	isfull = true;
}






