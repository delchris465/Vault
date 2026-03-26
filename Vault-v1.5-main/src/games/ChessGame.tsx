import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { RotateCcw, Users } from 'lucide-react';

export function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState('White to move');

  useEffect(() => {
    updateStatus();
  }, [game]);

  const updateStatus = () => {
    if (game.isCheckmate()) {
      setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
    } else if (game.isDraw()) {
      setStatus('Draw!');
    } else if (game.isStalemate()) {
      setStatus('Stalemate!');
    } else {
      setStatus(`${game.turn() === 'w' ? 'White' : 'Black'} to move${game.isCheck() ? ' (Check)' : ''}`);
    }
  };

  function makeAMove(move: any) {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      return result; // null if the move was illegal
    } catch (e) {
      return null;
    }
  }

  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: string, targetSquare: string | null }) {
    if (!targetSquare) return false;
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen for simplicity
    });

    // illegal move
    if (move === null) return false;
    return true;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#111] text-white p-4 sm:p-8 overflow-y-auto">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-violet-400" />
          2-Player Chess
        </h1>
        <div className="inline-block px-6 py-2 bg-white/10 rounded-full border border-white/5 shadow-lg mt-2">
          <p className={`text-lg font-bold ${game.isCheckmate() ? 'text-red-400' : game.turn() === 'w' ? 'text-white' : 'text-gray-400'}`}>
            {status}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[500px] bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl shadow-2xl border border-white/10">
        <Chessboard 
          options={{
            position: game.fen(),
            onPieceDrop: onDrop,
            darkSquareStyle: { backgroundColor: '#7c3aed' },
            lightSquareStyle: { backgroundColor: '#ddd6fe' },
            animationDurationInMs: 300
          }}
        />
      </div>

      <button
        onClick={() => setGame(new Chess())}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors border border-white/10"
      >
        <RotateCcw className="w-5 h-5" />
        Reset Board
      </button>
    </div>
  );
}
