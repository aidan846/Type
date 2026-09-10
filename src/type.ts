export let currentIndex = 0;
let currentWordIndex = 0;

export type TypingStats = {
    wpm: number;
    time: number;
    characters: number;
    backtracks: number;
    correct: number;
    wrong: number;
    correctWords: number;
    wrongWords: number;
    wordAccuracy: number;
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

let lastLineIndex = 0;

export function input(onFinish: (stats: TypingStats) => void, onRestart: () => void) {
    const characters = document.querySelectorAll(".character");
    characters[currentIndex].classList.add("current");

    document.addEventListener("keydown", (event) => { 
        if (finished) {
            if (event.code === "Space") {
                event.preventDefault();
                onRestart();
            }
            return;
        }

        const characters = document.querySelectorAll(".character");

        if (event.key.length === 1) {
            startTimer();
            
            if (event.key === characters[currentIndex].textContent) {
                characters[currentIndex].classList.add("correct");
                correct++;
                if (characters[currentIndex].classList.contains("space")) {
                    currentWordIndex++;
                }
            } else {
                //characters[currentIndex].textContent = event.key;
                characters[currentIndex].classList.add("wrong");
                wrong++;

                if (characters[currentIndex].classList.contains("space")) {
                    characters[currentIndex].textContent = event.key;
                    currentWordIndex++;
                } 
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
                    wrong: wrong,
                    correctWords: getWordStats().correctWords,
                    wrongWords: getWordStats().typedWords - getWordStats().correctWords,
                    wordAccuracy: getWordStats().typedWords > 0 ? Math.round((getWordStats().correctWords / getWordStats().typedWords) * 100) : 0,
                });
            } else {
                characters[currentIndex].classList.add("current");
                scrollToCurrentLine();
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
                    characters[currentIndex].textContent = characters[currentIndex].getAttribute("data-og");
                    wrong--;
                }
                
                characters[currentIndex].classList.remove("correct", "wrong");
                characters[currentIndex].classList.add("current");

                scrollToCurrentLine();

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

    const { correctCharacters } = getWordStats();

    return Math.round(correctCharacters / 5 / minutes);
}

export function resetTyping() {
    currentIndex = 0;
    currentWordIndex = 0;

    timerStarted = false;
    startTime = 0;

    elapsedTime = 0;
    currentWpm = 0;

    backtracks = 0;
    correct = 0;
    wrong = 0;

    finished = false;

    lastLineIndex = 0;

    if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
    }

    const timerLabel =
        document.querySelector(".timer-label") as HTMLParagraphElement | null;

    if (timerLabel) {
        timerLabel.textContent = "0s";
    }

    const words = document.querySelector<HTMLElement>("#words");

    if (words) {
        words.scrollTop = 0;
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

function getWordStats() {
    let correctCharacters = 0;
    let correctWords = 0;
    let typedWords = 0;

    const words = document.querySelectorAll(".word");

    for (const word of words) {
        const letters = word.querySelectorAll(".letter");
        const correctLetters = word.querySelectorAll(".letter.correct");
        const wrongLetters = word.querySelectorAll(".letter.wrong");

        const wordIsFinished = correctLetters.length + wrongLetters.length === letters.length;

        const wordIsCorrect = wordIsFinished && wrongLetters.length === 0;

        if (wordIsFinished) {
            typedWords++;
        }

        if (wordIsCorrect) {
            correctWords++;
            correctCharacters += word.textContent?.trim().length ?? 0;
        }
    }

    return {correctWords, typedWords, correctCharacters};
}

function scrollToCurrentLine() {
    const wordsContainer = document.querySelector<HTMLElement>("#words");
    const current = document.querySelector<HTMLElement>(".character.current");

    if (!wordsContainer || !current) {
        return;
    }

    const wordElements = Array.from(
        wordsContainer.querySelectorAll<HTMLElement>(".word")
    );

    const currentWord = current.closest<HTMLElement>(".word");

    if (!currentWord) {
        return;
    }

    const lineTops = [
        ...new Set(wordElements.map(word => word.offsetTop))
    ].sort((a, b) => a - b);

    const currentLineIndex = lineTops.indexOf(currentWord.offsetTop);

    if (currentLineIndex === lastLineIndex) {
        return;
    }

    lastLineIndex = currentLineIndex;

    if (wordsContainer.scrollHeight <= wordsContainer.clientHeight) {
        return;
    }

    const firstLineTop = lineTops[0];

    wordsContainer.scrollTo({
        top: lineTops[currentLineIndex] - firstLineTop,
        behavior: "smooth"
    });
}