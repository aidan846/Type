export interface Theme {
  /** Value of the `data-theme` attribute on <html>. Must match a block in themes.css. */
  id: string;
  /** Label shown in the theme dropdown. */
  name: string;
  /** Swatch colors, duplicated from themes.css so the dropdown can preview
      a theme without it being applied. Keep in sync with the CSS block. */
  bg: string;
  main: string;
}

export const DEFAULT_THEME = 'type';

export const themes: Theme[] = [
  { id: 'type', name: 'Type!', bg: '#f5efeb', main: '#3d352e' },
  { id: 'itype', name: 'Inverse Type!', bg: '#3d352e', main: '#f5efeb' },
  { id: 'white', name: 'White', bg: '#ffffff', main: '#aa3bff' },
];
