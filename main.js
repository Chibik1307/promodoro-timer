const stroke = document.querySelector(".stroke_progress");
const gradient = document.querySelector(".gradient_progress");


// смена текста кнопки "СТАРТ"/"СТОП"
function toggleText () {
    const play = document.querySelectorAll("#play, #stop");
    play.forEach(function (elem) {
        elem.classList.toggle("hidden");
    });
}

// смена значка "шестерёнки" на "галочку" и включение изменения времени
function changeTime () {
    const changedButtons = document.querySelectorAll("#check, #gear");
    changedButtons.forEach(function (elem) {
        elem.classList.toggle("hidden");
    });

    const changedPeriod = document.querySelectorAll("#minute, #second");
    changedPeriod.forEach(function (elem) {
        elem.setAttribute("contenteditable", elem.getAttribute("contenteditable") === "false" ? "true" : "false");
        elem.classList.toggle("timerChanged");
        elem.classList.toggle("time");
    });

    const startBtn = document.querySelector("#play");
    const startBtnDisabled = startBtn.getAttribute("disabled");
    startBtnDisabled ? startBtn.removeAttribute("disabled") : startBtn.setAttribute("disabled", true);
}

const settings = document.querySelector("#gear");
settings.addEventListener("click", changeTime);

const confirm = document.querySelector("#check");
confirm.addEventListener("click", confirmTime);

// проверка формата времени и его запись для дальнейшего использования
function confirmTime () {   
    if ((getSecond()) && !isNaN(getSecond()) && getSecond() > -1 && getSecond() < 60) {
        if ((getMinute()) && !isNaN(getMinute()) && getMinute() > -1 && getMinute() < 60) {
            minutesLeft = getMinute();
            secondsLeft = getSecond();
            changeTime();
        }
    }
    else {
        secondsLeft = 00;
        minutesLeft = 00;
        alert("Неверный формат времени");
    }
}

const getSecond = () => document.querySelector("#second").innerText;
const getMinute = () => document.querySelector("#minute").innerText;

// форматирование выводимого времени
function formatTime (time) {
    if (time < 10) {
        return `0${time}`;
    }
    return time;
}

let secondsPassed = 0; //прошло секунд

let secondInterval = null;

// запуск таймера
function startTimer() {
    if ((secondsLeft <= 0) && (minutesLeft <= 0)) {
        return;
    }
    stroke.classList.remove("stop");
    gradient.classList.remove("stop");
    movement();
    toggleText();
    secondInterval = setInterval(() => {
        if ((secondsLeft == 0) && (minutesLeft > 0)) {
            minutesLeft = minutesLeft - 1;
            document.getElementById("minute").innerText = formatTime(minutesLeft);
            secondsLeft = 60;
        }
        
        if ((secondsLeft < 1) && (minutesLeft <= 0)) {
            stroke.classList.add("stop");
            gradient.classList.add("stop");
            stroke.style.stroke = "#900A0A";
            stopTimer();
            alert("Время истекло!");
            return;
        }

        secondsPassed = secondsPassed + 1;
        secondsLeft = secondsLeft - 1;
        document.getElementById("second").innerText = formatTime(secondsLeft);
        
    }, 1000);
}

play.addEventListener("click", startTimer);

const stop = document.querySelector("#stop");
stop.addEventListener("click", clickPause);

// остановка таймера
function stopTimer() {
    clearInterval(secondInterval);
    toggleText();
}

function clickPause () {
    movementOff();
    stopTimer();
}

let paused = false;
let time;

// запуск анимации (градиент, граница)
function movement () {
    if (!paused) {
        time = Number(minutesLeft * 60) + Number(secondsLeft);
    }
    gradient.style.animationDuration = `${time}s`;
    gradient.style.animationPlayState = "running";

    stroke.style.animationDuration = `${time}s`;
    stroke.style.animationPlayState = "running";
    
    stroke.style.stroke = "#09A65A";
}

// остановка анимации
function movementOff () {
    paused = true;
    stroke.style.animationPlayState = "paused";
    gradient.style.animationPlayState = "paused";
    stroke.style.stroke = "#900A0A";
}