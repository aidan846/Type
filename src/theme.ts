import { themes, DEFAULT_THEME } from './themes.ts';

const STORAGE_KEY = 'theme';

/** The theme the user actually chose, as opposed to one being hover-previewed. */
let committed: string = readSaved();

function readSaved(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Paint a theme without saving it. Used for previews. */
function preview(id: string): void {
  document.documentElement.dataset.theme = id;
}

/** Paint a theme and remember it. */
function commit(id: string): void {
  committed = id;
  preview(id);
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode — theme just won't persist */
  }
}

export function themePickerMarkup(): string {
  const options = themes
    .map(
      theme => `
      <li class="theme-option" role="option" tabindex="-1"
          data-theme-id="${theme.id}"
          aria-selected="${theme.id === committed}">
        <span class="theme-swatch" style="--swatch-bg: ${theme.bg}; --swatch-main: ${theme.main}"></span>
        ${theme.name}
      </li>`
    )
    .join('');

  return `
<div class="theme-picker select-none" data-open="false">
  <button class="theme-toggle" aria-haspopup="listbox" aria-expanded="false">theme</button>
  <ul class="theme-list" role="listbox" aria-label="Theme" hidden>${options}</ul>
</div>`;
}

export function initThemePicker(): void {
  const picker = document.querySelector<HTMLDivElement>('.theme-picker')!;
  const toggle = picker.querySelector<HTMLButtonElement>('.theme-toggle')!;
  const list = picker.querySelector<HTMLUListElement>('.theme-list')!;
  const items = [...list.querySelectorAll<HTMLLIElement>('.theme-option')];

  const open = (): void => {
    list.hidden = false;
    picker.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    (items.find(i => i.dataset.themeId === committed) ?? items[0])?.focus();
  };

  const close = ({ restore }: { restore: boolean }): void => {
    if (restore) preview(committed);
    list.hidden = true;
    picker.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
  };

  const select = (id: string): void => {
    commit(id);
    for (const item of items) {
      item.setAttribute('aria-selected', String(item.dataset.themeId === id));
    }
    close({ restore: false });
    toggle.focus();
  };

  toggle.addEventListener('click', () => {
    if (list.hidden) open();
    else close({ restore: true });
  });

  // One delegated listener rather than mouseenter per row. mouseover bubbles;
  // mouseenter does not.
  list.addEventListener('mouseover', event => {
    const item = (event.target as HTMLElement).closest<HTMLLIElement>('.theme-option');
    if (item) preview(item.dataset.themeId!);
  });

  // Scoped to the list, NOT to each row: restoring on row-mouseleave flashes
  // the committed theme every time the pointer crosses between rows.
  list.addEventListener('mouseleave', () => preview(committed));

  list.addEventListener('click', event => {
    const item = (event.target as HTMLElement).closest<HTMLLIElement>('.theme-option');
    if (item) select(item.dataset.themeId!);
  });

  // Keyboard nav previews the same way hovering does.
  list.addEventListener('keydown', event => {
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current as HTMLLIElement);

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const next = items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
        next.focus();
        preview(next.dataset.themeId!);
        break;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (index >= 0) select(items[index].dataset.themeId!);
        break;
      case 'Escape':
        event.preventDefault();
        close({ restore: true });
        toggle.focus();
        break;
    }
  });

  // Tabbing away closes and reverts the preview.
  picker.addEventListener('focusout', event => {
    if (!picker.contains(event.relatedTarget as Node | null)) close({ restore: true });
  });

  document.addEventListener('pointerdown', event => {
    if (!list.hidden && !picker.contains(event.target as Node)) close({ restore: true });
  });
}
