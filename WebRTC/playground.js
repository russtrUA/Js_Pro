// 1. Create layout with styles - done
// 2. DOM navigation - done
// 3. Access to web camera - done
// 4. Stream data - done
// 5. Record video - done
// 6. Take snapshot - done
//HOMEWORK - add Download button, screen sharing and css
// 7. Download recorded video
// 8. Share screen

let recordedBlobs;
let mediaRecorder;
let urlBuffer;

// Get access to button nodes
const startButton = document.getElementById('start');
const recordButton = document.getElementById('record');
const playButton = document.getElementById('play');
const downloadButton = document.getElementById('download');
const snapshotButton = document.getElementById('snapshot');
const shareButton = document.getElementById('shareScreen');

// Get access to video nodes
const gumVideo = document.getElementById('gum');
const recordedVideo = document.getElementById('recorded');
const gumShare = document.getElementById('gum-local');

// Get access to canvas node
const canvas = document.querySelector('canvas');
//Get access to filter node
const filterSelect = document.querySelector('select#filter');
const sectionFilter = document.getElementById("sectionFilter");

//6. Share screen

function handleSuccessShare(stream) {
    shareButton.disabled = true;
    gumShare.srcObject = stream;

    // demonstrates how to detect that the user has stopped
    // sharing the screen via the browser UI.
    stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('The user has ended sharing the screen');
        shareButton.disabled = false;
        gumShare.srcObject = null;
    });
}

function handleErrorShare(error) {
    console.error(`getDisplayMedia error: ${error.name}`, error);
}

shareButton.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(handleSuccessShare, handleErrorShare);
});

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
    shareButton.disabled = false;
} else {
    console.error('getDisplayMedia is not supported');
}

//5. Download recorded video
downloadButton.addEventListener('click', function () {
    const link = document.createElement('a');
    link.href = urlBuffer;
    link.download = 'Recorded_video.webm';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})

// 4. Take snapshot
snapshotButton.addEventListener('click', () => {
    canvas.className = filterSelect.value;
    canvas.getContext('2d').drawImage(gumVideo, 0, 0, canvas.width, canvas.height);
})

// 3. Play recorded video
playButton.addEventListener('click', () => {
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = urlBuffer;
    recordedVideo.controls = true;
    recordedVideo.play();
})

// 2. Record video
const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

const startRecording = () => {
    recordedBlobs = [];
    const options = {
        mimeType: 'video/webm;codecs=vp9,opus'
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (error) {
        handleError(error);
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.addEventListener("stop", () => {
        const buffer = new Blob(recordedBlobs, { type: 'video/webm' });
        urlBuffer = window.URL.createObjectURL(buffer);
    });
    mediaRecorder.start();
}

const stopRecording = () => {
    mediaRecorder.stop();
}

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Record') {
        recordButton.textContent = 'Stop recording';
        startRecording();
    } else {
        recordButton.textContent = 'Record';
        playButton.disabled = false;
        downloadButton.disabled = false;
        stopRecording();
    }
})

// 1. Stream data
const handleSuccess = (stream) => {
    gumVideo.srcObject = stream;
    window.stream = stream;
    recordButton.disabled = false;
    snapshotButton.disabled = false;
    sectionFilter.classList.toggle("hide");
}

const handleError = (error) => {
    console.error(`navigator getUserMedia error: ${error}`);
}

const init = (constraints) => {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError)
}

startButton.addEventListener('click', () => {
    if (startButton.innerText === 'Start camera') {
        startButton.innerText = 'Stop camera';

        const constraints = {
            audio: true,
            video: {
                width: 1280,
                height: 720
            }
        }
        init(constraints);

    } else {
        window.stream.getTracks().forEach(function (track) {
            track.stop();
        });
        startButton.innerText = 'Start camera';
        recordButton.disabled = true;
        playButton.disabled = true;
        downloadButton.disabled = true;
        snapshotButton.disabled = true;
        window.stream = null;
        gumVideo.srcObject = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = null;
        recordedVideo.controls = false;
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        sectionFilter.classList.toggle("hide");
    }
})