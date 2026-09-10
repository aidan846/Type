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

  { id: 'midnight', name: 'Midnight', bg: '#11131a', main: '#7c8cff' },
  { id: 'dracula', name: 'Dracula', bg: '#282a36', main: '#bd93f9' },
  { id: 'nord', name: 'Nord', bg: '#2e3440', main: '#88c0d0' },
  { id: 'catppuccin', name: 'Catppuccin', bg: '#1e1e2e', main: '#cba6f7' },

  { id: 'rose', name: 'Rose', bg: '#fff7f8', main: '#d96c86' },
  { id: 'sakura', name: 'Sakura', bg: '#fff5fa', main: '#f08bb5' },
  { id: 'matcha', name: 'Matcha', bg: '#f4f7ed', main: '#718b55' },
  { id: 'forest', name: 'Forest', bg: '#172019', main: '#7aa874' },
  { id: 'evergreen', name: 'Evergreen', bg: '#0f1c18', main: '#52b788' },

  { id: 'ocean', name: 'Ocean', bg: '#0d1821', main: '#4ea8de' },
  { id: 'ice', name: 'Ice', bg: '#f0f7fa', main: '#54a7c4' },
  { id: 'arctic', name: 'Arctic', bg: '#edf6f9', main: '#2e9cca' },

  { id: 'vaporwave', name: 'Vaporwave', bg: '#171229', main: '#f06cff' },
  { id: 'synthwave', name: 'Synthwave', bg: '#160f26', main: '#ff7edb' },
  { id: 'cyber', name: 'Cyber', bg: '#080b10', main: '#00f5c4' },
  { id: 'terminal', name: 'Terminal', bg: '#090d0a', main: '#55ff76' },
  { id: 'hacker', name: 'Hacker', bg: '#050805', main: '#34ff5a' },

  { id: 'ember', name: 'Ember', bg: '#1c1512', main: '#e67e45' },
  { id: 'lava', name: 'Lava', bg: '#180c0c', main: '#ff5a36' },
  { id: 'sunset', name: 'Sunset', bg: '#24171c', main: '#ff8a5c' },
  { id: 'solar', name: 'Solar', bg: '#fff8df', main: '#e6a817' },

  { id: 'coffee', name: 'Coffee', bg: '#211b18', main: '#c38f67' },
  { id: 'latte', name: 'Latte', bg: '#f7f1e8', main: '#b07d62' },
  { id: 'peach', name: 'Peach', bg: '#fff5ed', main: '#ed8b63' },

  { id: 'lavender', name: 'Lavender', bg: '#f7f3fc', main: '#9d7bd8' },
  { id: 'grape', name: 'Grape', bg: '#1c1625', main: '#aa75e8' },
  { id: 'neon-purple', name: 'Neon Purple', bg: '#100c18', main: '#b94cff' },

  { id: 'mono', name: 'Mono', bg: '#151515', main: '#d6d6d6' },
  { id: 'graphite', name: 'Graphite', bg: '#202124', main: '#aeb4bd' },
  { id: 'oled', name: 'OLED', bg: '#000000', main: '#ffffff' },

  { id: 'blueprint', name: 'Blueprint', bg: '#10263c', main: '#75c4ff' },
  { id: 'navy', name: 'Navy', bg: '#101827', main: '#6e9de8' },
  { id: 'mint', name: 'Mint', bg: '#effaf6', main: '#49ad8c' },

  { id: 'candy', name: 'Candy', bg: '#fff4fa', main: '#d75db0' },
  { id: 'bubblegum', name: 'Bubblegum', bg: '#fff2f8', main: '#ff76b5' },

  { id: 'retro', name: 'Retro', bg: '#eee8cf', main: '#d06f3f' },
  { id: 'gameboy', name: 'Gameboy', bg: '#c7d5a0', main: '#3d5433' },
  { id: 'matrix', name: 'Matrix', bg: '#020805', main: '#00ff41' },

  { id: 'crimson', name: 'Crimson', bg: '#1a1012', main: '#db4655' },
  { id: 'mustang', name: 'Mustang', bg: '#101113', main: '#3f75d9' },
  { id: 'gulf', name: 'Gulf', bg: '#f5f1e8', main: '#55a9c5' },
  { id: 'miami', name: 'Miami', bg: '#12131c', main: '#ff5db1' },
  { id: 'cyber-blue', name: 'Cyber Blue', bg: '#071119', main: '#00c8ff' },

  { id: 'cream', name: 'Cream', bg: '#faf7ef', main: '#575045' },
  { id: 'paper', name: 'Paper', bg: '#f8f6f0', main: '#3c3b37' },
  { id: 'sepia', name: 'Sepia', bg: '#f2e8d5', main: '#76583b' },

  { id: 'night-sky', name: 'Night Sky', bg: '#0c1322', main: '#7597e8' },
  { id: 'aurora', name: 'Aurora', bg: '#101c20', main: '#5bd6b2' },
];
