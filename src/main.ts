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
          (word, index) => `
            <span class="word">
              ${word
                .split("")
                .map((letter) =>`<span class="letter character" data-og="${letter}">${letter}</span>`)
                .join("")
              }${
                index < words.length - 1 ? `<span class="space character" data-og=" "> </span>`: ""
              }
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

let wordAmount = 30;

async function resetWords() {
  const words: string[] = await getWords(wordAmount);

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
          <span>words</span>
          <strong>${stats.correctWords}/${stats.correctWords + stats.wrongWords}</strong>
        </div>

        <div class="result-stat">
          <span>accuracy</span>
          <strong>${stats.wordAccuracy}%</strong>
        </div>

        <br>
        <div class="result-stat">
          <span>characters</span>
          <strong>${stats.characters}</strong>
        </div>

        <div class="result-stat">
          <span>backtracks</span>
          <strong>${stats.backtracks}</strong>
        </div>

        <div class="result-stat">
          <span>correct</span>
          <strong>${stats.correct}</strong>
        </div>

        <div class="result-stat">
          <span>wrong</span>
          <strong>${stats.wrong}</strong>
        </div>
        <br>
        <p>press <kbd>Space</kbd> to restart</p>
      </div>
    </div>
  `;
}

const words: string[] = await getWords(wordAmount);
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<nav class="navbar flex items-center justify-between">
  <div class="relative flex items-center justify-between w-full">
    <!-- Left section -->
    <div class="left flex items-center gap-4 select-none">
      ${logoMarkup()}
      <button class="restart">↻</button>
      <button class="word-amount-btn" data-amount="15">15</button>
      <button class="word-amount-btn" data-amount="30">30</button>
      <button class="word-amount-btn" data-amount="60">60</button>
      <button class="word-amount-btn" data-amount="120">120</button>
    </div>

    <!-- Middle section -->
    <div class="midsection absolute left-1/2 -translate-x-1/2 flex items-center gap-4 select-none">
      <p class="timer-label">0s</p>
      <!-- <p class="prev-label">wpm: 0</p> -->
    </div>
    
    <!-- Right section -->
    <div class="right select-none">
      ${themePickerMarkup()}
    </div>
  </div>
</nav>

<section id="center">
  ${renderWords(words)}
</section>

<footer class="flex items-center justify-between">
  <!-- Left section -->
  <div class="left flex items-center gap-4 select-none">
    <p class="best-label ${bestWpm === 0 ? "hidden" : ""}">
      best: ${bestWpm} wpm
    </p>
  </div>
</footer>
`;

document
  .querySelector<HTMLButtonElement>(".restart")!
  .addEventListener("click", (event) => {
    (event.currentTarget as HTMLButtonElement).blur();
    resetWords();
  });

document
  .querySelectorAll<HTMLButtonElement>(".word-amount-btn")
  .forEach((button) => {
    button.addEventListener("click", () => {
      wordAmount = Number(button.dataset.amount);
      resetWords();
      button.blur();
    });
  });

initThemePicker();
input(showResults, resetWords);