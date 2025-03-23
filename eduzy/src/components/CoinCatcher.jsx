import React, { useEffect, useState, useRef } from "react";
import coinImg from "/assets/coin.png";
import basketImg from "/assets/basket.png";

const TreasureToss = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coins, setCoins] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(window.innerWidth / 2 - 50); // Basket starts in the middle
  const coinsRef = useRef(coins); // Use ref to avoid direct state mutation

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // Generate random falling coins (with fewer coins)
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (coins.length < 3) { // Limit to 3 coins falling at a time
          const newCoin = {
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 100), // Random X position
            y: 0, // Start from top
            speed: Math.random() * 3 + 2, // Different falling speeds
          };
          setCoins((prevCoins) => [...prevCoins, newCoin]);
        }
      }, 2000); // Increased interval to make fewer coins fall
      return () => clearInterval(interval);
    }
  }, [gameOver, coins.length]);

  // Move coins down & check if they are caught
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setCoins((prev) =>
          prev
            .map((coin) => ({ ...coin, y: coin.y + coin.speed }))
            .filter((coin) => {
              // Check if coin is caught by basket
              const isCaught =
                coin.y > window.innerHeight - 120 && // Coin reaches basket height
                coin.x > basketX - 30 && // Coin is within left side of basket
                coin.x < basketX + 80; // Coin is within right side of basket

              if (isCaught) {
                setScore((prev) => prev + 10); // Increase score
              }

              return !isCaught && coin.y < window.innerHeight; // Remove caught/out of screen coins
            })
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [gameOver, basketX]);

  // Handle basket movement with left & right arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setBasketX((prev) => Math.max(prev - 30, 0)); // Move left but not outside
      } else if (e.key === "ArrowRight") {
        setBasketX((prev) => Math.min(prev + 30, window.innerWidth - 100)); // Move right but not outside
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clear out coins after the game is over to avoid rendering
  useEffect(() => {
    if (gameOver) {
      setCoins([]);
    }
  }, [gameOver]);

  return (
    <div className="h-screen bg-gradient-to-b from-blue-400 to-purple-500 text-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Score & Timer */}
      <div className="absolute top-3 left-3 border border-white p-3 bg-black bg-opacity-30 rounded-md">
        <h3 className="text-xl">Score: <span>{score}</span></h3>
        <h3 className="text-xl">Time Left: <span>{timeLeft}</span> sec</h3>
      </div>

      {/* Falling Coins */}
      {!gameOver ? (
        <div className="relative w-full h-full">
          {coins.map((coin) => (
            <img
              key={coin.id}
              src={coinImg}
              alt="coin"
              className="absolute w-12 h-12 transition-transform duration-150"
              style={{ top: `${coin.y}px`, left: `${coin.x}px` }}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white p-6 rounded-lg">
          <h3 className="text-2xl">Game Over!</h3>
          <h1 className="text-4xl font-bold">Final Score: {score}</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-lg tracking-wider border border-red-500 text-white rounded-lg mt-4 transition-all duration-300 hover:bg-transparent hover:border-white"
          >
            Restart 🔄
          </button>
        </div>
      )}

      {/* Basket (Controlled by Arrow Keys) */}
      <img
        src={basketImg}
        alt="basket"
        className="absolute w-[100px] bottom-10"
        style={{ left: `${basketX}px` }}
      />
    </div>
  );
};

export default TreasureToss;
