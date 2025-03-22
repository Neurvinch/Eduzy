import React, { useEffect, useState, useRef } from "react";
import coinImg from "/assets/coin.png";
import basketImg from "/assets/basket.png";

const TreasureToss = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [coins, setCoins] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [basketX, setBasketX] = useState(window.innerWidth / 2 - 50);
  const coinsRef = useRef(coins);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  // Generate random falling coins - MORE FREQUENT
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (coins.length < 5) { // Increased max coins from 3 to 5
          const newCoin = {
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 100),
            y: 0,
            speed: Math.random() * 5 + 7, // Increased speed range from (2-5) to (7-12)
          };
          setCoins((prevCoins) => [...prevCoins, newCoin]);
        }
      }, 800); // Reduced interval from 2000ms to 800ms
      return () => clearInterval(interval);
    }
  }, [gameOver, coins.length]);

  // Move coins down faster & check if they are caught
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setCoins((prev) =>
          prev
            .map((coin) => ({ ...coin, y: coin.y + coin.speed }))
            .filter((coin) => {
              const isCaught =
                coin.y > window.innerHeight - 120 &&
                coin.x > basketX - 30 &&
                coin.x < basketX + 80;

              if (isCaught) {
                setScore((prev) => prev + 10);
              }

              return !isCaught && coin.y < window.innerHeight;
            })
        );
      }, 30); // Reduced interval from 50ms to 30ms for smoother, faster movement
      return () => clearInterval(interval);
    }
  }, [gameOver, basketX]);

  // Handle basket movement with left & right arrow keys - FASTER MOVEMENT
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setBasketX((prev) => Math.max(prev - 50, 0)); // Increased movement from 30 to 50
      } else if (e.key === "ArrowRight") {
        setBasketX((prev) => Math.min(prev + 50, window.innerWidth - 100)); // Increased movement from 30 to 50
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) {
      setCoins([]);
    }
  }, [gameOver]);

  return (
    <div className="h-screen overflow-hidden relative" 
         style={{ 
           background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><rect width=\"40\" height=\"40\" fill=\"%23f8f8f8\"/><path d=\"M0 0h40v1H0zM0 0v40h1V0z\" fill=\"%23e0e0e0\"/></svg>')",
           fontFamily: "'Rubik', sans-serif"
         }}>
      {/* Game Title */}
      <div className="absolute top-3 left-3 z-10">
        <h1 className="text-5xl font-black tracking-tighter m-0" style={{ color: "#FF5733" }}>
          BVOOOOR
        </h1>
      </div>

      {/* Score & Timer */}
      <div className="absolute top-20 left-3 p-4 rounded-lg z-10" 
           style={{ 
             background: "#FFF", 
             border: "3px solid #000",
             boxShadow: "5px 5px 0px #000"
           }}>
        <h3 className="text-2xl font-black m-0" style={{ color: "#333" }}>
          SCORE: <span className="text-3xl" style={{ color: "#FF5733" }}>{score}</span>
        </h3>
        <h3 className="text-2xl font-black m-0 mt-2" style={{ color: "#333" }}>
          TIME: <span className="text-3xl" style={{ color: "#FF5733" }}>{timeLeft}</span>
        </h3>
      </div>

      {/* Game Speed Indicator */}
      <div className="absolute top-3 right-3 p-2 rounded-lg z-10" 
           style={{ 
             background: "#FF5733", 
             border: "2px solid #000",
             boxShadow: "3px 3px 0px #000"
           }}>
        <p className="text-lg font-black m-0" style={{ color: "#FFF" }}>
          SPEED: TURBO 🚀
        </p>
      </div>

      {/* Falling Coins */}
      {!gameOver ? (
        <div className="relative w-full h-full">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="absolute"
              style={{ top: `${coin.y}px`, left: `${coin.x}px` }}
            >
              <img
                src={coinImg}
                alt="coin"
                className="w-12 h-12"
                style={{ 
                  filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))",
                  transform: "rotate(" + (Math.random() * 360) + "deg)"
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20" 
             style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
          <div className="p-8 rounded-xl text-center"
               style={{ 
                 background: "#FFF", 
                 border: "5px solid #000",
                 boxShadow: "8px 8px 0px #000",
                 maxWidth: "500px"
               }}>
            <h3 className="text-3xl font-black mb-2" style={{ color: "#FF5733" }}>GAME OVER!</h3>
            <h1 className="text-5xl font-black mb-6" style={{ color: "#333" }}>SCORE: {score}</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-2xl font-black tracking-wider rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: "#FF5733", 
                color: "white",
                border: "3px solid #000",
                boxShadow: "5px 5px 0px #000"
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Basket */}
      <div
        className="absolute bottom-10"
        style={{ left: `${basketX}px` }}
      >
        <img
          src={basketImg}
          alt="basket"
          className="w-[100px]"
          style={{ 
            filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
          }}
        />
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-3 right-3 p-3 rounded-lg" 
           style={{ 
             background: "#FFF", 
             border: "2px solid #000",
             boxShadow: "3px 3px 0px #000"
           }}>
        <p className="text-lg font-bold m-0" style={{ color: "#333" }}>
          Use ← → arrows to move
        </p>
      </div>
    </div>
  );
};

export default TreasureToss;