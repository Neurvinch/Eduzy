import React, { useEffect, useState } from "react";
import hammerImg from "/assets/hammer.png";
import moleImg from "/assets/mole.png";
import moleWhackedImg from "/assets/mole-whacked.png";

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moleIndex, setMoleIndex] = useState(null);
  const [whackedIndex, setWhackedIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 100 });
  const [hammerHit, setHammerHit] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      setMoleIndex(null);
    }
  }, [timeLeft]);

  // Mole appears randomly
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setMoleIndex(Math.floor(Math.random() * 9));
        setWhackedIndex(null);
      }, 2000); // New mole appears every 2 sec

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  // Handle mole hit
  const handleHit = (index) => {
    setHammerHit(true); // Hammer animation

    setTimeout(() => {
      setHammerHit(false); // Reset hammer after hit
    }, 150);

    if (index === moleIndex) {
      setScore((prev) => prev + 10);
      setWhackedIndex(index); // Show whacked mole
      setMoleIndex(null); // Hide normal mole

      setTimeout(() => {
        setWhackedIndex(null); // Hide whacked mole after 300ms
      }, 300);
    }
  };

  // Track cursor movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX - 30, y: e.clientY - 30 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen bg-green-700 text-white flex flex-col items-center justify-center overflow-hidden relative cursor-none">
      {/* Score & Timer */}
      <div className="absolute top-3 left-3 border border-white p-3 bg-black bg-opacity-40 rounded-md">
        <h3 className="text-xl font-bold">Score: <span>{score}</span></h3>
        <h3 className="text-xl font-bold">Time Left: <span>{timeLeft}</span> sec</h3>
      </div>

      {/* Game Grid */}
      {!gameOver ? (
        <div className="grid grid-cols-3 gap-10 w-[500px] h-[500px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="hole w-28 h-28 bg-orange-700 rounded-full shadow-lg relative overflow-hidden flex justify-center items-end"
              onClick={() => handleHit(index)}
            >
              {moleIndex === index && (
                <img
                  src={moleImg}
                  alt="mole"
                  className="w-[70%] cursor-pointer transition-transform duration-200 ease-in-out transform translate-y-3"
                />
              )}
              {whackedIndex === index && (
                <img
                  src={moleWhackedImg}
                  alt="whacked mole"
                  className="w-[70%] transition-opacity duration-300 opacity-100"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white p-6 rounded-lg">
          <h3 className="text-2xl font-bold">Game Over!</h3>
          <h1 className="text-4xl font-bold">Final Score: {score}</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-500 text-lg tracking-wider border border-teal-500 text-white rounded-lg mt-4 transition-all duration-300 hover:bg-transparent hover:border-white"
          >
            Restart 🔄
          </button>
        </div>
      )}

      {/* Custom Cursor (Hammer) */}
      <div
        className={`w-[110px] h-[110px] absolute bg-no-repeat bg-contain pointer-events-none transition-transform duration-150 ${
          hammerHit ? "rotate-[-45deg]" : ""
        }`}
        style={{
          backgroundImage: `url(${hammerImg})`,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          transform: hammerHit ? "rotate(-45deg) scale(1.1)" : "rotate(0)",
        }}
      ></div>
    </div>
  );
};

export default WhackAMole;