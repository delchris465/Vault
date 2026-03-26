import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

type Grid = number[][];
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SIZE = 4;

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(Array(SIZE).fill(null).map(() => Array(SIZE).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  const addRandomTile = (currentGrid: Grid) => {
    const emptyCells: {r: number, c: number}[] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({r, c});
      }
    }
    if (emptyCells.length > 0) {
      const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    return currentGrid;
  };

  const resetGame = () => {
    let newGrid = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    let newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    const slideAndMerge = (row: number[]) => {
      let filtered = row.filter(val => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < SIZE) filtered.push(0);
      return filtered;
    };

    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let r = 0; r < SIZE; r++) {
        let row = newGrid[r];
        if (direction === 'RIGHT') row.reverse();
        let newRow = slideAndMerge(row);
        if (direction === 'RIGHT') newRow.reverse();
        if (newGrid[r].join(',') !== newRow.join(',')) moved = true;
        newGrid[r] = newRow;
      }
    } else {
      for (let c = 0; c < SIZE; c++) {
        let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
        if (direction === 'DOWN') col.reverse();
        let newCol = slideAndMerge(col);
        if (direction === 'DOWN') newCol.reverse();
        for (let r = 0; r < SIZE; r++) {
          if (newGrid[r][c] !== newCol[r]) moved = true;
          newGrid[r][c] = newCol[r];
        }
      }
    }

    if (moved) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      checkGameOver(newGrid);
    }
  }, [grid, score, gameOver]);

  const checkGameOver = (currentGrid: Grid) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentGrid[r][c] === 0) return;
        if (c < SIZE - 1 && currentGrid[r][c] === currentGrid[r][c + 1]) return;
        if (r < SIZE - 1 && currentGrid[r][c] === currentGrid[r + 1][c]) return;
      }
    }
    setGameOver(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') move('UP');
      if (e.key === 'ArrowDown' || e.key === 's') move('DOWN');
      if (e.key === 'ArrowLeft' || e.key === 'a') move('LEFT');
      if (e.key === 'ArrowRight' || e.key === 'd') move('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number) => {
    const colors: Record<number, string> = {
      2: 'bg-gray-800 text-gray-300',
      4: 'bg-gray-700 text-gray-200',
      8: 'bg-orange-600 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-red-500 text-white',
      64: 'bg-red-600 text-white',
      128: 'bg-yellow-500 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]',
      256: 'bg-yellow-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.6)]',
      512: 'bg-yellow-300 text-gray-900 shadow-[0_0_20px_rgba(253,224,71,0.7)]',
      1024: 'bg-yellow-200 text-gray-900 shadow-[0_0_25px_rgba(254,240,138,0.8)]',
      2048: 'bg-yellow-100 text-gray-900 shadow-[0_0_30px_rgba(254,240,138,1)]',
    };
    return colors[val] || 'bg-black/50 text-white shadow-[0_0_40px_rgba(255,255,255,0.8)]';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#111] text-white font-sans outline-none" tabIndex={0}>
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          2048
        </h1>
        <div className="flex gap-4">
          <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Score</span>
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm">Use <kbd className="bg-white/10 px-2 py-1 rounded">Arrow Keys</kbd> or <kbd className="bg-white/10 px-2 py-1 rounded">WASD</kbd> to move tiles.</p>
      </div>

      <div className="relative bg-[#1a1a1a] p-3 rounded-2xl shadow-2xl border border-white/10">
        <div className="grid grid-cols-4 gap-3">
          {grid.map((row, r) => (
            row.map((val, c) => (
              <div key={`${r}-${c}`} className="w-16 h-16 sm:w-24 sm:h-24 bg-black/30 rounded-xl flex items-center justify-center relative">
                <AnimatePresence>
                  {val !== 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                      className={`absolute inset-0 flex items-center justify-center rounded-xl font-bold text-2xl sm:text-4xl transition-colors ${getTileColor(val)}`}
                    >
                      {val}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ))}
        </div>

        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-full font-bold transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
