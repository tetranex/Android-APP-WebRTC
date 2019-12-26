/**
 * Main 
 * 
 * @author Nikola Tabakovic
 */
$(document).ready(function() {
	
(function(videoRC) {
	
	creeper.videoHeight = window.innerHeight - 80;
		
	var socket = new videoRC.VRCSocket()
	var videoManager = new VRC.VideoManager(socket);
		
})(window.videoRC);

});