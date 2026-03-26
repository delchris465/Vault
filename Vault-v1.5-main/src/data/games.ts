export interface Game {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  embedUrl: string;
}

export const games: Game[] = [
  // Action
  { id: 'snake', title: 'Neon Snake', category: 'Action', thumbnail: '', embedUrl: 'native:SnakeGame' },
  { id: 'venge-io', title: 'Venge.io', category: 'Action', thumbnail: '', embedUrl: 'https://venge.io/' },
  { id: 'ev-io', title: 'Ev.io', category: 'Action', thumbnail: '', embedUrl: 'https://ev.io/' },
  { id: 'geometry-dash', title: 'Geometry Dash', category: 'Action', thumbnail: '', embedUrl: 'https://geometrydash-free.github.io/' },
  { id: 'bloxd', title: 'Bloxd.io', category: 'Sandbox', thumbnail: '', embedUrl: 'https://bloxdk12.com/' },
  { id: 'surviv-io', title: 'Surviv.io', category: 'Action', thumbnail: '', embedUrl: 'https://surviv.io/' },
  { id: 'stickman-archers', title: 'Stickman Archers', category: 'Action', thumbnail: '', embedUrl: 'https://stickmanarcher.github.io/' },
  { id: 'bad-time-sim', title: 'Bad Time Simulator', category: 'Action', thumbnail: '', embedUrl: 'https://jcw87.github.io/c2-sans-fight/' },
  { id: 'pokevoid', title: 'PokeVoid', category: 'Action', thumbnail: '', embedUrl: 'https://pokevoid.com/' },

  // Clicker
  { id: 'neon-clicker', title: 'Sigma Clicker', category: 'Clicker', thumbnail: '', embedUrl: 'native:NeonClicker' },
  { id: 'epstein-clicker', title: 'Epstein Clicker', category: 'Clicker', thumbnail: '', embedUrl: 'https://epsteinclicker.com/' },
  { id: 'doge-miner', title: 'Doge Miner 2', category: 'Clicker', thumbnail: '', embedUrl: 'https://realben9.github.io/dm2sc/play/' },

  // Puzzle
  { id: 'block-blast', title: 'Block Blast', category: 'Puzzle', thumbnail: '', embedUrl: 'https://blockblastonline.com/' },
  { id: 'hextris', title: 'Hextris', category: 'Puzzle', thumbnail: '', embedUrl: 'https://hextris.io/' },
  { id: 'tetris', title: 'Tetris', category: 'Puzzle', thumbnail: '', embedUrl: 'https://chvin.github.io/react-tetris/?lan=en' },
  { id: 'sudoku', title: 'Sudoku', category: 'Puzzle', thumbnail: '', embedUrl: 'https://sudoku.com/' },
  { id: '2048', title: '2048', category: 'Puzzle', thumbnail: '', embedUrl: 'native:Game2048' },
  { id: 'little-alchemy-2', title: 'Little Alchemy 2', category: 'Puzzle', thumbnail: '', embedUrl: 'https://littlealchemy2.com/' },
  { id: 'draw-climber', title: 'Draw Climber', category: 'Puzzle', thumbnail: '', embedUrl: 'https://drawclimber.io/' },
  { id: 'stack-rush', title: 'Stack Rush', category: 'Puzzle', thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/stack-rush/' },

  // Sports
  { id: 'basket-random', title: 'Basket Random', category: 'Sports', thumbnail: '', embedUrl: 'https://files.twoplayergames.org/files/games/other/Basket_Random/index.html' },
  { id: 'soccer-random', title: 'Soccer Random', category: 'Sports', thumbnail: '', embedUrl: 'https://files.twoplayergames.org/files/games/other/Soccer_Random/index.html' },
  { id: 'volley-random', title: 'Volley Random', category: 'Sports', thumbnail: '', embedUrl: 'https://www.twoplayergames.org/game/volley-random' },
  { id: 'boxing-random', title: 'Boxing Random', category: 'Sports', thumbnail: '', embedUrl: 'https://files.twoplayergames.org/files/games/other/Boxing_Random/index.html' },
  { id: 'rocketgoal', title: 'Rocketgoal.io', category: 'Sports', thumbnail: '', embedUrl: 'https://rocketgoal.io/' },
  { id: 'super-liquid-soccer', title: 'Super Liquid Soccer', category: 'Sports', thumbnail: '', embedUrl: 'https://superliquidsoccer.github.io/' },
  { id: '8-ball-pool', title: '8 Ball Pool', category: 'Sports', thumbnail: '', embedUrl: 'https://8ball.io/' },

  // IO Games
  { id: 'paper-io-2', title: 'Paper.io 2', category: 'IO Games', thumbnail: '', embedUrl: 'https://paper-io.com/' },
  { id: 'territorial-io', title: 'Territorial.io', category: 'IO Games', thumbnail: '', embedUrl: 'https://territorial.io/' },
  { id: 'papercraft-io', title: 'Papercraft.io', category: 'IO Games', thumbnail: '', embedUrl: 'https://papercraft.io/' },
  { id: 'slowroads', title: 'Slowroads', category: 'IO Games', thumbnail: '', embedUrl: 'https://slowroads.io/' },

  // Racing
  { id: 'drift-boss', title: 'Drift Boss', category: 'Racing', thumbnail: '', embedUrl: 'https://driftboss.io/' },

  // ASMR
  { id: 'knife-asmr', title: 'Knife Cutting ASMR', category: 'ASMR', thumbnail: '', embedUrl: 'https://www.miniplay.com/embed/knife-hit' },
  { id: 'spiral-roll', title: 'Spiral Roll ASMR', category: 'ASMR', thumbnail: '', embedUrl: 'https://spiralroll.github.io/' },

  // Fun
  { id: 'random-website', title: 'Random Website Button', category: 'Fun', thumbnail: '', embedUrl: 'https://theuselessweb.com/' },

  // Papa's Series
  { id: 'papas-pizzeria', title: "Papa's Pizzeria", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papa-s-pizzeria/' },
  { id: 'papas-burgeria', title: "Papa's Burgeria", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papas-burgeria/' },
  { id: 'papas-cupcakeria', title: "Papa's Cupcakeria", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papa-s-cupcakeria/' },
  { id: 'papas-freezeria', title: "Papa's Freezeria", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papa-s-freezeria/' },
  { id: 'papas-scooperia', title: "Papa's Scooperia", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papas-scooperia/' },
  { id: 'papas-wingeria', title: "Papa's Wingeria", category: "Papa's", thumbnail: '', embedUrl: 'https://www.gameflare.com/embed/papas-wingeria/' },

  // Classics
  { id: 'chess', title: 'Chess (2 Player)', category: 'Classics', thumbnail: '', embedUrl: 'native:ChessGame' },
  { id: 'tic-tac-toe', title: 'Tic Tac Toe (2 Player)', category: 'Classics', thumbnail: '', embedUrl: 'native:TicTacToe' },
  { id: 'solitaire', title: 'Solitaire', category: 'Classics', thumbnail: '', embedUrl: 'https://www.google.com/logos/fnbx/solitaire/standalone.html' },
  { id: 'bitlife', title: 'BitLife', category: 'Classics', thumbnail: '', embedUrl: 'https://bitlifeonline.github.io/' },
];
