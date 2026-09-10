import "./style.css";
import { getWords } from "./getWords.ts";
import { themePickerMarkup, initThemePicker, logoMarkup } from "./theme.ts";
import { input, resetTyping, type TypingStats } from './type.ts';

let bestWpm = Number(localStorage.getItem("bestWpm")) || 0;

function renderWords(words: string[]) {
  return `
    <div id="words" class="select-none">
    ${words
      .map(
        (word) => `
          <span class="word">
            ${word
              .split("")
              .map((letter) => `<span class="letter character">${letter}</span>`)
              .join("")}
          </span>
        `,
      )
      .join('<span class="space character"> </span>')}
  </div>
  `;
}

async function resetWords() {
  const words: string[] = await getWords(30);

  const center = document.querySelector<HTMLDivElement>("#center")!;

  center.innerHTML = renderWords(words);

  document
    .querySelectorAll(".midsection")
    .forEach(section => section.classList.remove("hidden"));

  resetTyping();
}

function showResults(stats: TypingStats) {
  const center = document.querySelector("#center")!;

  const midsection = document.querySelectorAll(".midsection")
  midsection.forEach((section) => section.classList.add("hidden"));

  const bestLabel = document.querySelector(".best-label")!;

  if (stats.wpm > bestWpm) {
    bestWpm = stats.wpm;

    localStorage.setItem("bestWpm", bestWpm.toString());

    bestLabel.textContent = `best: ${bestWpm} wpm`;
    bestLabel.classList.remove("hidden");
  }

  center.innerHTML = `
    <div class="results">
      <div class="items-center text-center justify-between w-full">
        <div class="result-stat">
          <span>wpm</span>
          <strong>${stats.wpm}</strong>
        </div>

        <div class="result-stat">
          <span>time</span>
          <strong>${stats.time.toFixed(2)}s</strong>
        </div>

        <div class="result-stat">
          <span>characters</span>
          <strong>${stats.characters}</strong>
        </div>

        <p>backtracks: ${stats.backtracks}</p>
        <p>correct: ${stats.correct}</p>
        <p>wrong: ${stats.wrong}</p>
        <br>
        <p>press <kbd>Space</kbd> to restart</p>
      </div>
    </div>
  `;
}

const words: string[] = await getWords(30);
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<nav class="navbar flex items-center justify-between">
  <div class="relative flex items-center justify-between w-full">
    <!-- Left section -->
    <div class="left flex items-center gap-4">
      ${logoMarkup()}
      <button class="restart">↻</button>
      <p class="best-label ${bestWpm === 0 ? "hidden" : ""}">
        best: ${bestWpm} wpm
      </p>
    </div>

    <!-- Middle section -->
    <div class="midsection absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
      <p class="timer-label">0s</p>
      <!-- <p class="prev-label">wpm: 0</p> -->
    </div>
    
    <!-- Right section -->
    <div class="right">
      ${themePickerMarkup()}
    </div>
  </div>
</nav>

<section id="center">
  ${renderWords(words)}
</section>
`;

document
  .querySelector<HTMLButtonElement>(".restart")!
  .addEventListener("click", resetWords);

document.addEventListener("keydown", (event) => {
  if (
    event.code === "Space" &&
    document.querySelector(".results")
  ) {
    event.preventDefault();
    resetWords();
  }
});

initThemePicker();
input(showResults, resetWords);