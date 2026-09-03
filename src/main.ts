import './style.css'
import { getWords } from './getWords.ts'
import { themePickerMarkup, initThemePicker } from './theme.ts';

async function resetWords() {
  const words: string[] = await getWords(30);

  const wordsContainer = document.querySelector<HTMLDivElement>('#words')!;

  wordsContainer.innerHTML = words.map(word => `<span class="word">${word}</span>`).join('');
}

const words: string[] = await getWords(30);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<nav class="navbar flex items-center justify-between">
  <div class="left flex items-center gap-4">
    <img src="/favicon.svg" alt="Type! Logo">
    <button class="restart">↻</button>
    <p class="best-label">best: 90 wpm</p>
  </div>
  <div class="right">
    ${themePickerMarkup()}
  </div>
</nav>

<section id="center">
  <div id="words" class="select-none">
    ${words.map(word => `<span class="word">${word}</span>`).join('')}
  </div>
</section>
`;

document.querySelector<HTMLButtonElement>('.restart')!.addEventListener('click', resetWords);

initThemePicker();
