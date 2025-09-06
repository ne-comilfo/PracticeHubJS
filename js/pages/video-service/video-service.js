import loadHeader from "../../services/load-header";

loadHeader();

const videoPlayer = document.querySelector('video'),
    playPauseBtn = document.querySelector('.controls__play-pause'),
    screenChangeBtn = document.querySelector('.controls__screen'),
    playerWrapper = document.querySelector('.player'),
    inputRange = document.querySelector('input'),
    currentTime = document.querySelector('.controls__time'),
    volumeBtn = document.querySelector('.controls__sound'),
    volumeRange = document.querySelector('.volume-bar input');

function updateVolume () {
    const icon = volumeBtn.querySelector('i');
    icon.className = '';

    if (videoPlayer.muted || videoPlayer.volume === 0) {
        icon.classList.add('fas', 'fa-volume-mute');
    } else if (videoPlayer.volume <= 0.5) {
        icon.classList.add('fas', 'fa-volume-down');
    } else {
        icon.classList.add('fas', 'fa-volume-up');
    }
}

playPauseBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        videoPlayer.play();
    } else {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        videoPlayer.pause();
    }
})

videoPlayer.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

screenChangeBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        playerWrapper.requestFullscreen();
        screenChangeBtn.innerHTML = '<i class="fas fa-compress"></i>'
    } else {
        document.exitFullscreen();
        screenChangeBtn.innerHTML = '<i class="fas fa-expand"></i>'
    }
});

document.addEventListener('fullscreenchange', () => {
    const icon = screenChangeBtn.querySelector('i');
    if (document.fullscreenElement) {
        icon.classList.replace('fa-expand', 'fa-compress');
    } else {
        icon.classList.replace('fa-compress', 'fa-expand');
    }
})

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            if (videoPlayer.paused) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                videoPlayer.play();
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                videoPlayer.pause();
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            videoPlayer.currentTime += 5;
            break;
        case 'ArrowLeft':
            videoPlayer.currentTime -= 5;
            break;
    }
})

videoPlayer.addEventListener('timeupdate', () => {
    const time = Math.floor(videoPlayer.currentTime / videoPlayer.duration * 100);
    inputRange.value = time;
    let minutes = ''+Math.floor(videoPlayer.currentTime / 60);
    let seconds = ''+Math.floor(videoPlayer.currentTime % 60);
    minutes = minutes.padStart(2, '0');
    seconds = seconds.padStart(2, '0');
    currentTime.innerHTML = `${minutes}:${seconds}`;
    inputRange.style.background = `linear-gradient(to right, #ff5722 0%, #ff5722 ${time}%, #ddd ${time}%, #ddd 100%)`;
});

inputRange.addEventListener('input', () => {
    videoPlayer.currentTime = (inputRange.value * videoPlayer.duration) / 100;
    const time = videoPlayer.currentTime / videoPlayer.duration * 100;
    inputRange.style.background = `linear-gradient(to right, #ff5722 0%, #ff5722 ${time}%, #ddd ${time}%, #ddd 100%)`;
})

videoPlayer.addEventListener('volumechange', updateVolume);

volumeBtn.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolume();
})

volumeRange.addEventListener('input', () => {
    videoPlayer.volume = volumeRange.value;
    const percent = volumeRange.value * 100; 
    volumeRange.style.background = `linear-gradient(to right, #ff5722 0%, #ff5722 ${percent}%, #ddd ${percent}%, #ddd 100%)`;
    videoPlayer.muted = volumeRange.value == 0;
    updateVolume();
});