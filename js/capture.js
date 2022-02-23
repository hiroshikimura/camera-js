$(document).ready(function(){
  console.log('hello world');
  camera_init();
});

function camera_init() {
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    console.log('camera OK');
  }

  feather.replace();

  const controls = document.querySelector('.controls');
  const cameraOptions = document.querySelector('.video-options>select');
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');
  const screenshotImage = document.querySelector('img');
  const imageList = document.querySelector('image-list');
  const buttons = [...controls.querySelectorAll('button')];
  let streamStarted = false;

  const [play, pause, screenshot] = buttons;

  const constraints = {
    video: {
      width: {
        min: 1280,
        ideal: 1920,
        max: 2560
      },
      height: {
        min: 720,
        ideal: 1080,
        max: 1440
      },
    }
  };

  const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind=='videoinput');
    const options = videoDevices.map(videoDevice => {
      return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`
    })
    cameraOptions.innerHTML = options.join('');
  }

  play.onclick = () => {
    if (streamStarted) {
      video.play();
      play.classList.add('d-none');
      pause.classList.remove('d-none');
      return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      const updatedConstraints = {
        ...constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      };
      startStream(updatedConstraints);
    }
  }

  const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
  }

  const handleStream = (stream) => {
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    screenshot.classList.remove('d-none');
    streamStarted = true;
  }

  cameraOptions.onchange = () => {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  };
  
  const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
  };
  
  const doScreenshot = () => {
    let image = document.createElement('img');
    let imageList = document.querySelector('.image-list');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    image.src = canvas.toDataURL('image/webp');
    image.classList.add('screenshot-image');
    imageList.classList.remove('d-none');
    imageList.appendChild(image);
  };
  
  pause.onclick = pauseStream;
  screenshot.onclick = doScreenshot;

  getCameraSelection();
}
