export let currentIndex = 0;

export type TypingStats = {
    wpm: number;
    time: number;
    characters: number;
    backtracks: number;
    correct: number;
    wrong: number;
};

let timer: number | undefined;
let timerStarted = false;
let startTime = 0;

let elapsedTime = 0;
let currentWpm = 0;

let backtracks = 0;
let correct = 0;
let wrong = 0;

let finished = false;

export function input(onFinish: (stats: TypingStats) => void) {
    const characters = document.querySelectorAll(".character");
    characters[currentIndex].classList.add("current");

    document.addEventListener("keydown", (event) => { 
        if (finished) {
            return;
        }

        const characters = document.querySelectorAll(".character");

        if (event.key.length === 1) {
            startTimer();
            
            if (event.key === characters[currentIndex].textContent) {
                characters[currentIndex].classList.add("correct");
                correct++;
            } else if (event.key !== characters[currentIndex].textContent) {
                characters[currentIndex].classList.add("wrong");
                wrong++;
            }
            characters[currentIndex].classList.remove("current");
            currentIndex += 1;
            if (currentIndex === characters.length) {
                stopTimer();
                finished = true;

                onFinish({
                    wpm: currentWpm,
                    time: elapsedTime,
                    characters: currentIndex,
                    backtracks: backtracks,
                    correct: correct,
                    wrong: wrong
                });
            } else {
                characters[currentIndex].classList.add("current");
            }
        }
        if (event.key === "Backspace") {
            if (currentIndex > 0) {
                if (currentIndex < characters.length) {
                    characters[currentIndex].classList.remove("current");
                }

                currentIndex -= 1;

                if (characters[currentIndex].classList.contains("correct")) {
                    correct--;
                } else if (characters[currentIndex].classList.contains("wrong")) {
                    wrong--;
                }

                characters[currentIndex].classList.remove("correct", "wrong");
                characters[currentIndex].classList.add("current");

                backtracks++;
            }
        }
    });
}

function calculateWpm(elapsedSeconds: number) {
    const minutes = elapsedSeconds / 60;

    if (minutes <= 0) {
        return 0;
    }

    return Math.round((currentIndex / 5) / minutes);
}

export function resetTyping() {
    currentIndex = 0;
    timerStarted = false;
    startTime = 0;

    elapsedTime = 0;
    currentWpm = 0;

    backtracks = 0;
    correct = 0;
    wrong = 0;

    finished = false;

    if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
    }

    const timerLabel =
        document.querySelector(".timer-label") as HTMLParagraphElement | null;

    if (timerLabel) {
        timerLabel.textContent = "0s";
    }

    const characters = document.querySelectorAll(".character");

    if (characters.length > 0) {
        characters[0].classList.add("current");
    }
}

export function startTimer() {
    const timerLabel = document.querySelector(".timer-label") as HTMLParagraphElement;

    if (!timerStarted) {
        timerStarted = true;
        startTime = performance.now();

        timer = window.setInterval(() => {
            elapsedTime = (performance.now() - startTime) / 1000;
            currentWpm = calculateWpm(elapsedTime);

            timerLabel.textContent = `${elapsedTime.toFixed(1)}s`;
        }, 100);
    }
}

export function stopTimer() {
    const timerLabel = document.querySelector(".timer-label") as HTMLParagraphElement;

    if (timerStarted) {
        timerStarted = false;

        if (timer !== undefined) {
            clearInterval(timer);
        }

        elapsedTime = (performance.now() - startTime) / 1000;
        currentWpm = calculateWpm(elapsedTime);
        timerLabel.textContent = `${elapsedTime.toFixed(2)}s`;
    }
}