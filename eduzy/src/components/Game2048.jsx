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
    2: "bg-yellow-300 border-yellow-400",
    4: "bg-orange-300 border-orange-400",
    8: "bg-red-300 border-red-400",
    16: "bg-pink-400 border-pink-500",
    32: "bg-purple-400 border-purple-500",
    64: "bg-indigo-400 border-indigo-500",
    128: "bg-blue-400 border-blue-500",
    256: "bg-green-400 border-green-500",
    512: "bg-teal-400 border-teal-500",
    1024: "bg-cyan-400 border-cyan-500",
    2048: "bg-amber-400 border-amber-500",
  };
  return colors[num] || "bg-gray-700 border-gray-800";
};

const Game2048 = () => {
  const [grid, setGrid] = useState(() => generateRandomTile(getEmptyGrid()));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = (e) => {
    if (gameOver) return;

    const keyMap = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
    if (keyMap[e.key] !== undefined) {
      setGrid(currentGrid => {
        const newGrid = move(currentGrid, keyMap[e.key], setScore);
        
        if (isGameOver(newGrid)) {
          setGameOver(true);
        }
        
        return newGrid;
      });
    }
  };

  const restartGame = () => {
    setGrid(generateRandomTile(getEmptyGrid()));
    setScore(0);
    setGameOver(false);
  };

  const quitGame = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-white" style={{ 
        backgroundImage: "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Decorative shapes */}
      <div className="absolute top-20 right-20">
        <div className="w-24 h-24 bg-orange-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 left-20">
        <div className="w-20 h-20 bg-green-500 rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-6xl font-extrabold text-black px-4 tracking-tight">
            MERGE 
          </h1>
          <div className="bg-pink-400 rounded-lg p-2 px-4 transform rotate-2 border-4 border-black">
            <span className="text-6xl font-extrabold text-black">MASTER</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="mb-8 flex items-center">
          <div className="bg-yellow-400 border-4 border-black rounded-full px-6 py-2 shadow-lg transform -rotate-2">
            <span className="text-2xl font-bold">SCORE: {score}</span>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white border-4 border-black rounded-xl p-4 shadow-lg relative">
          <div className="grid grid-cols-4 gap-3">
            {grid.map((row, rowIndex) =>
              row.map((num, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-bold rounded-lg border-4 border-black shadow-md transform ${num ? 'scale-100' : 'scale-95'} transition-all ${
                    getTileColor(num)
                  }`}
                >
                  {num}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={restartGame}
            className="bg-white border-4 border-black rounded-full px-6 py-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 relative"
          >
            <span className="relative z-10">RESTART</span>
            <div className="absolute inset-0 bg-blue-400 rounded-full -top-2 -left-2 -z-10"></div>
          </button>
          
          <button
            onClick={quitGame}
            className="bg-white border-4 border-black rounded-full px-6 py-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 relative"
          >
            <span className="relative z-10">QUIT</span>
            <div className="absolute inset-0 bg-red-400 rounded-full -top-2 -left-2 -z-10"></div>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white border-4 border-black rounded-lg p-3 max-w-md">
          <p className="text-center font-bold">Use arrow keys to move tiles. Combine same numbers to reach 2048!</p>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
          <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md w-full mx-4 relative">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-black transform rotate-12">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>

            <h2 className="text-4xl font-extrabold text-center mb-4">GAME OVER!</h2>
            <div className="bg-yellow-400 border-4 border-black rounded-lg p-2 mb-6 text-center">
              <p className="text-2xl font-bold">FINAL SCORE: {score}</p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={restartGame}
                className="bg-white border-4 border-black rounded-full px-6 py-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 relative"
              >
                <span className="relative z-10">PLAY AGAIN</span>
                <div className="absolute inset-0 bg-blue-400 rounded-full -top-2 -left-2 -z-10"></div>
              </button>
              
              <button
                onClick={quitGame}
                className="bg-white border-4 border-black rounded-full px-6 py-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 relative"
              >
                <span className="relative z-10">BACK TO GAMES</span>
                <div className="absolute inset-0 bg-red-400 rounded-full -top-2 -left-2 -z-10"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;