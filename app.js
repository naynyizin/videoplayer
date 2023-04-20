const container = document.querySelector(".container"),
    mainVideo = document.querySelector(".mainvideo"),
    videoTimeline = document.querySelector(".video-timeline"),
    currentTimetxt = document.querySelector(".current-time"),
    durationtxt = document.querySelector(".video-duration"),
    volumebtn = document.querySelector(".volume i"),
    volumeSlider = document.querySelector(".left input"),
    progressBar = document.querySelector(".progress-bar"),
    skipBackward = document.querySelector(".skip-backward i"),
    skipForward = document.querySelector(".skip-forward i"),
    playpausebtn = document.querySelector(".play-pause i"),
    speedbtn = document.querySelector(".playback-speed span"),
    speedOption = document.querySelector(".speed-options"),
    picinpicbtn = document.querySelector(".pic-in-pic span"),
    fullscreenbtn = document.querySelector(".full-screen i");

let timer;

const hidecontrols = () => {
    if (mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
};

hidecontrols();

container.addEventListener("mousemove", () => {
    clearTimeout(timer);
    container.classList.add("show-controls");
    hidecontrols();
});

const formatTime = (time) => {
    let seconds = Math.floor(time % 60,)
    minutes = Math.floor((time / 60) % 60),
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

// progress function
mainVideo.addEventListener('timeupdate', (e) => {

    let { currentTime, duration } = e.target;
    let widthPersent = (currentTime / duration) * 100;
    progressBar.style.width = `${widthPersent}%`;
    currentTimetxt.textContent = formatTime(currentTime); // current time txt
});

// duration txt
mainVideo.addEventListener('loadeddata', (e) => {
    durationtxt.textContent = formatTime(e.target.duration);
});

// video timeline
videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

// drag timeline

const dragmousemove = (e) => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentTimetxt.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
    videoTimeline.addEventListener("mousemove", dragmousemove);
});

container.addEventListener("mouseup", () => {
    videoTimeline.removeEventListener("mousemove", dragmousemove);
});

// for mousemove timeline
videoTimeline.addEventListener("mousemove", e => {
    const progressTime = videoTimeline.querySelector("span");
    let offsetX = e.offsetX;
    if (offsetX < 50) {
        progressTime.style.left = `50px`;
    } else if (offsetX > 850) {
        progressTime.style.left = `850px`;
    } else {
        progressTime.style.left = `${offsetX}px`;
    }
    let persent = (e.offsetX / videoTimeline.clientWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(persent)
});

// volume function
volumebtn.addEventListener("click", () => {
    if (!volumebtn.classList.contains('fa-volume-high')) {
        mainVideo.volume = 0.5;
        volumeSlider.value = 0.5;
        volumebtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    } else {
        mainVideo.volume = 0;
        volumebtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    }
});

// volume control
volumeSlider.addEventListener("input", (e) => {
    mainVideo.volume = e.target.value;
    if (e.target.value == 0) {
        volumebtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else {
        volumebtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
})


// Backward 5s function
skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 5;
});


// Forward 5s function
skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 5;
});

// play & pause function
playpausebtn.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

// change play/pause icon
mainVideo.addEventListener("play", () => {
    playpausebtn.classList.replace("fa-play", "fa-pause");
});

// change play/pause icon
mainVideo.addEventListener("pause", () => {
    playpausebtn.classList.replace("fa-pause", "fa-play");
});

// toggle show option
speedbtn.addEventListener("click", (e) => {
    speedOption.classList.toggle("show");
});

// remove show class
document.addEventListener("click", (e) => {
    if (e.target.className !== "material-symbols-outlined" || e.target.tagName !== "SPAN") {
        speedOption.classList.remove("show");
    }
});

// playback rate function
speedOption.querySelectorAll('li').forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOption.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    })
});

// pic in pic
picinpicbtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture();
});

// fullscreen
fullscreenbtn.addEventListener('click', () => {
    container.classList.toggle("fullscreen");
    if (document.fullscreenElement) {
        fullscreenbtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullscreenbtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

