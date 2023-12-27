////////////////////////////////////////////////////////////
// INIT
////////////////////////////////////////////////////////////
 var stageWidth,stageHeight=0;
 var isLoaded=false;
 
 /*!
 * 
 * DOCUMENT READY
 * 
 */
 $(function() {
	 var resumeAudioContext = function() {
		// handler for fixing suspended audio context in Chrome
		try {
			if (createjs.WebAudioPlugin.context.state === "suspended") {
				createjs.WebAudioPlugin.context.resume();
				// Should only need to fire once
				window.removeEventListener("click", resumeAudioContext);
			}
		} catch (e) {
			// SoundJS context or web audio plugin may not exist
			console.error("There was an error while trying to resume the SoundJS Web Audio context...");
			console.error(e);
		}
	};
	window.addEventListener("click", resumeAudioContext);
	 
	 // Check for running exported on file protocol
	if (window.location.protocol.substr(0, 4) === "file"){
		alert("To install the game just upload folder 'game' to your server. The game won't run locally with some browser like Chrome due to some security mode.");
	}
	 
	
	$(window).resize(function(){
		resizeLoaderFunc();
	});
	resizeLoaderFunc();
	checkBrowser();
});

/*!
 * 
 * LOADER RESIZE - This is the function that runs to centeralised loader when resize
 * 
 */
 function resizeLoaderFunc(){
	stageWidth=$(window).width();
	stageHeight=$(window).height();
	
	$('#mainLoader').css('left', checkContentWidth($('#mainLoader')));
	$('#mainLoader').css('top', checkContentHeight($('#mainLoader')));
 }

/*!
 * 
 * BROWSER DETECT - This is the function that runs for browser and feature detection
 * 
 */
var browserSupport=false;
var isTablet;
function checkBrowser(){
	isTablet = (/ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase()));
	deviceVer=getDeviceVer();
	
	var canvasEl = document.createElement('canvas');
	if(canvasEl.getContext){ 
	  browserSupport=true;
	}
	
	if(browserSupport){
		if(!isLoaded){
			isLoaded=true;

			detectAddScript(true, false);
		}
	}else{
		//browser not support
		$('#notSupportHolder').show();
	}
}

function detectAddScript(score, mrs){
	if(score){
		if(checkAddScript("scoreboard/css/score.css", "scoreboard/js/score.js")){
			if(mrs){
				if(checkAddScript("memberrewards/css/memberrewards.css", "memberrewards/js/memberrewards.js")){
					doneAddScript();
				}else{
					doneAddScript();
				}
			}else{
				doneAddScript();
			}
		}else{
			doneAddScript();
		}
	}else{
		doneAddScript();
	}
}

function checkAddScript(styleFile, scriptFile){
	var styleExist = checkFileExist(styleFile);
	var scriptExist = checkFileExist(scriptFile);

	if(styleExist & scriptExist){
		$('head').append('<link rel="stylesheet" type="text/css" href="'+styleFile+'">');
		$('head').append('<script type="text/javascript" src="'+scriptFile+'"></script>');
		return true;
	}else{
		return false;
	}
}

function doneAddScript(){
	//memberpayment
	if(typeof memberData != 'undefined' && enableMembership){
		initGameSettings();
	}else{
		initPreload();
	}
}

function checkFileExist(urlToFile) {
    var response = jQuery.ajax({
		url: urlToFile,
		type: 'HEAD',
		async: false
	}).status;	
	
	return (response != "200") ? false : true;
}