import "./style.css";
import { getWords } from "./getWords.ts";
import { themePickerMarkup, initThemePicker, logoMarkup } from "./theme.ts";
import { input, resetTyping, type TypingStats } from './type.ts';
import { StorageKeys, getStorageItem, setStorageItem } from './storage.ts';

function getWpmKey(amount: number): keyof typeof StorageKeys {
  return `wpm${amount}` as keyof typeof StorageKeys;
}

let wordAmount = Number(getStorageItem(StorageKeys.mode)) || 30;
let bestWpm = Number(getStorageItem(getWpmKey(wordAmount))) || 0;

//let bestWpm = Number(localStorage.getItem("bestWpm")) || 0;

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

function updateBestLabel(wpm: number) {
  const bestLabel = document.querySelector(".best-label")!;
  if(!bestLabel) return;

  if (wpm > 0) {
    bestLabel.textContent = `${wpm} wpm`;
    bestLabel.classList.remove("hidden");
  } else {
    bestLabel.classList.add("hidden");
  }
}

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

  const currentKey = getWpmKey(wordAmount);
  let currentBest = Number(getStorageItem(currentKey)) || 0;

  if (stats.wpm > currentBest) {
    currentBest = stats.wpm;
    setStorageItem(currentKey, currentBest.toString());
  }

  updateBestLabel(currentBest);

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
      <button class="word-amount-btn ${wordAmount === 15 ? 'active' : ''}" data-amount="15">15</button>
      <button class="word-amount-btn ${wordAmount === 30 ? 'active' : ''}" data-amount="30">30</button>
      <button class="word-amount-btn ${wordAmount === 60 ? 'active' : ''}" data-amount="60">60</button>
      <button class="word-amount-btn ${wordAmount === 120 ? 'active' : ''}" data-amount="120">120</button>
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

      setStorageItem(StorageKeys.mode, wordAmount.toString());

      document.querySelectorAll(".word-amount-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const newBest = Number(getStorageItem(getWpmKey(wordAmount))) || 0;
      updateBestLabel(newBest);

      resetWords();
      button.blur();
    });
  });

initThemePicker();
input(showResults, resetWords);