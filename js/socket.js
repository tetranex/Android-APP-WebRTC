(function() {
  var remotePeerConnection;
  var sdpConstraints = {
    'mandatory' : {
      'OfferToReceiveAudio' : false,
      'OfferToReceiveVideo' : true
    }
  };


  var Sock = function() {
    var socket;
    if (!window.WebSocket) {
      window.WebSocket = window.MozWebSocket;
    }


    if (window.WebSocket) {
      socket = new WebSocket("ws://localhost:8080/websocket");
      socket.onopen = onopen;
      socket.onmessage = onmessage;
      socket.onclose = onclose;
    } else {
      alert("Your browser does not support Web Socket.");
    }


    function onopen(event) {
      getTextAreaElement().value = "Web Socket opened!";
    }


    function onmessage(event) {
      appendTextArea(event.data);


      sdpOffer = new RTCSessionDescription(JSON.parse(event.data));


      remotePeerConnection = new webkitRTCPeerConnection(null);
      remotePeerConnection.onaddstream = gotRemoteStream;


      trace("Java Offer: \n" + sdpOffer.sdp);
      remotePeerConnection.setRemoteDescription(sdpOffer);
      remotePeerConnection.createAnswer(gotRemoteDescription, onCreateSessionDescriptionError, sdpConstraints);


    }
    function onCreateSessionDescriptionError(error) {
      console.log('Failed to create session description: '
          + error.toString());
    }

    function gotRemoteDescription(answer) {
      remotePeerConnection.setLocalDescription(answer);
      trace("Browser's Answer: \n" + answer.sdp);


      socket.send(JSON.stringify(answer));
    }


    function gotRemoteStream(event) {
      var remoteVideo = document.getElementById("remoteVideo");
      remoteVideo.src = URL.createObjectURL(event.stream);
      trace("Received remote stream");
    }


    function onclose(event) {
      appendTextArea("Web Socket closed");
    }


    function appendTextArea(newData) {
      var el = getTextAreaElement();
      el.value = el.value + '\n' + newData;
    }


    function getTextAreaElement() {
      return document.getElementById('responseText');
    }


    function trace(text) {
      console.log((performance.now() / 1000).toFixed(3) + ": " + text);
    }


  }
  window.addEventListener('load', function() {
    new Sock();
  }, false);
})();