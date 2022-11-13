// DOM
const recorderDiv = document.querySelector('#recorder');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const closeButton = document.querySelector('#close');
const video = document.querySelector('#player video');

// variables
let recorder, stream;

// functions
async function start() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      mediaSource: "screen",
      width: 3840,
      height: 2160,
    },
    preferCurrentTab: true
  });
  recorder = new MediaRecorder(stream);

  const chunks = [];
  recorder.ondataavailable = (e) => { chunks.push(e.data) };
  recorder.onstart = () => {
    recorderDiv.classList.toggle('recording', true);
    recorderDiv.classList.toggle('replaying', false);
  }
  recorder.onstop = (e) => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    video.src = URL.createObjectURL(completeBlob);
    recorderDiv.classList.toggle('recording', false);
    recorderDiv.classList.toggle('replaying', true);
  }
  recorder.start();
}

function stop() {
  recorder.stop();
  stream.getVideoTracks()[0].stop();
}

function closePreview() {
  recorderDiv.classList.toggle('recording', false);
  recorderDiv.classList.toggle('replaying', false);
}

startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);
closeButton.addEventListener('click', closePreview);