import React, { useState } from 'react';
import Board from './Board';
import './Game.css';
import { History, Squares, SquareMark, Cell } from '../types';

function calculateWinner(
  squares: Squares
): { mark: SquareMark; lines: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { mark: squares[a], lines: lines[i] };
    }
  }
  return null;
}

const Game: React.FC = () => {
  const [history, setHistory] = useState<History>([
    {
      squares: Array(9).fill(null),
      number: 0,
    },
  ]);
  const [xIsNext, setNext] = useState<boolean>(true);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [locations, setLocations] = useState<Cell>([
    {
      row: null,
      col: null,
    },
  ]);
  const [asc, toggle] = useState<boolean>(true);

  const orderedHistory = asc ? history : history.slice().reverse();
  const moves = orderedHistory.map(step => {
    const move = step.number;
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button
          style={move === stepNumber ? { fontWeight: 'bold' } : undefined}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  function jumpTo(step: number) {
    setStepNumber(step);
    setNext(step % 2 === 0);
  }

  const location = locations.map((location, i) => {
    if (location.row === null) return null;
    return (
      <li key={i}>
        <span>row: {location.row}</span>
        <span>col: {location.col}</span>
      </li>
    );
  });

  const current = history[stepNumber];
  const currentSquares = current.squares;
  const winner = calculateWinner(currentSquares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner.mark;
  } else if (winner === null && history.length === 10) {
    status = 'Draw game';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function handleClick(i: number) {
    const targetNumber = stepNumber + 1;
    const target = history.slice(0, targetNumber);
    const squares = currentSquares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(target.concat([{ squares, number: targetNumber }]));
    setNext(!xIsNext);
    setStepNumber(target.length);

    const newLocations = locations.slice(0, targetNumber);
    setLocations(
      newLocations.concat([
        {
          row: Math.floor(i / 3) + 1,
          col: (i % 3) + 1,
        },
      ])
    );
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          onClick={i => handleClick(i)}
          lines={winner === null ? null : winner.lines}
        />
        <ol>{location}</ol>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => toggle(!asc)}>toggle moves order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
