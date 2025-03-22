import React, { useState, useEffect } from "react";

const GRID_SIZE = 4;

const getEmptyGrid = () =>
  Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(null));

const generateRandomTile = (grid) => {
  let emptyCells = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) emptyCells.push({ row: rowIndex, col: colIndex });
    });
  });

  if (emptyCells.length === 0) return grid;

  const { row, col } =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[row][col] = Math.random() < 0.9 ? 2 : 4;

  return [...grid];
};

// Move left and update score
const moveLeft = (grid, setScore) => {
  let newGrid = grid.map((row) => {
    let filteredRow = row.filter((num) => num !== null);
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        setScore((prev) => prev + filteredRow[i]); // Increase score
        filteredRow[i + 1] = null;
      }
    }
    return filteredRow.filter((num) => num !== null).concat(Array(GRID_SIZE).fill(null)).slice(0, GRID_SIZE);
  });

  return newGrid;
};

const rotateGrid = (grid) =>
  grid[0].map((_, index) => grid.map((row) => row[index])).reverse();

const move = (grid, direction, setScore) => {
  let newGrid = [...grid];

  for (let i = 0; i < direction; i++) newGrid = rotateGrid(newGrid);

  newGrid = moveLeft(newGrid, setScore);

  for (let i = 0; i < (4 - direction) % 4; i++) newGrid = rotateGrid(newGrid);

  return generateRandomTile(newGrid);
};

const isGameOver = (grid) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) return false;
      if (col < GRID_SIZE - 1 && grid[row][col] === grid[row][col + 1])
        return false;
      if (row < GRID_SIZE - 1 && grid[row][col] === grid[row + 1][col])
        return false;
    }
  }
  return true;
};

const getTileColor = (num) => {
  const colors = {
    2: "bg-yellow-200 text-gray-800",
    4: "bg-yellow-300 text-gray-800",
    8: "bg-orange-400 text-white",
    16: "bg-orange-500 text-white",
    32: "bg-red-400 text-white",
    64: "bg-red-500 text-white",
    128: "bg-green-400 text-white",
    256: "bg-green-500 text-white",
    512: "bg-blue-400 text-white",
    1024: "bg-blue-500 text-white",
    2048: "bg-purple-500 text-white",
  };
  return colors[num] || "bg-gray-700 text-white";
};

const Game2048 = () => {
  const [grid, setGrid] = useState(generateRandomTile(getEmptyGrid()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = (e) => {
    if (gameOver) return;

    const keyMap = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
    if (keyMap[e.key] !== undefined) {
      let newGrid = move(grid, keyMap[e.key], setScore);
      setGrid(newGrid);

      if (isGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const restartGame = () => {
    setGrid(generateRandomTile(getEmptyGrid()));
    setScore(0);
    setGameOver(false);
  };

  const quitGame = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">2048 Game</h1>

      {/* Score Display */}
      <div className="mb-4 text-lg font-semibold">
        Score: <span className="text-yellow-400">{score}</span>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center text-white z-50">
          <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
          <p className="text-2xl mb-2">Final Score: <span className="text-yellow-400">{score}</span></p>
          <button
            onClick={restartGame}
            className="bg-blue-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition mb-2"
          >
            Restart
          </button>
          <button
            onClick={quitGame}
            className="bg-red-500 px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition"
          >
            Quit
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg shadow-lg relative">
        {grid.map((row, rowIndex) =>
          row.map((num, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-lg ${getTileColor(
                num
              )}`}
            >
              {num}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Game2048;
