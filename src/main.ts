import './style.css'
import { getWords } from './getWords.ts'
import { themePickerMarkup, initThemePicker } from './theme.ts';
import { input } from './type.ts'

async function resetWords() {
  const words: string[] = await getWords(30);
  currentIndex = 0;

  const wordsContainer = document.querySelector<HTMLDivElement>('#words')!;

  wordsContainer.innerHTML = words.map(word => `<span class="word">${word}</span>`).join('');
}

const words: string[] = await getWords(30);
export let currentIndex: number = 0;

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
    ${words
  .map(word =>
    word
      .split('')
      .map(letter => `<span class="letter">${letter}</span>`)
      .join('')
  )
  .join('<span class="space"> </span>')}
  </div>
</section>
`;

document.querySelector<HTMLButtonElement>('.restart')!.addEventListener('click', resetWords);

initThemePicker();
input();

//${words.map(word => `<span class="word">${word}</span>`).join('')}