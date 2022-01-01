
navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
navigator.getWebcam({ audio: true, video: true }, 
     function (stream) {
                let Peer = require('simple-peer');
        let peer = new Peer({
            initiator: location.hash === '#init', // One peer should initiate the connection
            trickle: false,
            stream: stream
        }); // Creating new instance of Peer class

        // Create peer id, which can be used by others to connect to you. When initiator is true, this is called automatically at the beginning
        peer.on('signal', (data) => {
            console.dir(data);
            document.getElementById('yourId').value = JSON.stringify(data);
        });

        peer.on('error', err => console.log('error', err))

        document.getElementById('connect').addEventListener('click', () => {
            let peerId = JSON.parse(document.getElementById('peerId').value);
            // Initiates peer connection
            peer.signal(peerId);
        });


        document.getElementById('send').addEventListener('click', () => {
            let yourMessage = document.getElementById('yourMessage').value;
            peer.send(yourMessage);
        });


        peer.on('data', (data) => {
            document.getElementById('messages').textContent += data + '\n';
        });

        peer.on('stream', (stream) => {
            let video = document.createElement('video');
            document.body.appendChild(video);

            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }
            video.play();
        });
     }, 
     function (err) { 
         logError("Web cam is not accessible."); 
         console.log(err);
    }
     
);