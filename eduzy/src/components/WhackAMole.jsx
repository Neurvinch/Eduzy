import React, { useEffect, useState, useRef } from "react";
import hammerImg from "/assets/hammer.png";
import moleImg from "/assets/mole.png";
import moleWhackedImg from "/assets/mole-whacked.png";

const WhackAMole = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moleIndex, setMoleIndex] = useState(null);
  const [whackedIndex, setWhackedIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 100 });
  const [hammerHit, setHammerHit] = useState(false);
  
  // Player struggle detection
  const [missedHits, setMissedHits] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [difficulty, setDifficulty] = useState("medium"); // easy, medium, hard
  const [moleStayTime, setMoleStayTime] = useState(2000); // Time mole stays visible
  const [moleHideTime, setMoleHideTime] = useState(500); // Time between moles
  const [pointsPerHit, setPointsPerHit] = useState(15); // Points per successful hit
  
  const moleTimerRef = useRef(null);
  const hintRef = useRef(null);
  const nextMoleTimerRef = useRef(null);
  
  // Start game function
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setMissedHits(0);
    setLastScoreTime(Date.now());
    setShowHint(false);
    setShowEncouragement(false);
    
    // Apply difficulty settings when starting the game
    applyDifficultySettings(difficulty);
  };
  
  // Apply difficulty settings
  const applyDifficultySettings = (diffLevel) => {
    switch (diffLevel) {
      case "easy":
        setMoleStayTime(3000); // Mole stays visible for 3 seconds
        setMoleHideTime(800); // Longer time between moles
        setPointsPerHit(10);
        break;
      case "medium":
        setMoleStayTime(2000); // Mole stays visible for 2 seconds
        setMoleHideTime(500); // Medium time between moles
        setPointsPerHit(15);
        break;
      case "hard":
        setMoleStayTime(1200); // Mole stays visible for 1.2 seconds
        setMoleHideTime(300); // Short time between moles
        setPointsPerHit(20);
        break;
      default:
        setMoleStayTime(2000);
        setMoleHideTime(500);
        setPointsPerHit(15);
    }
  };
  
  // Timer countdown
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft === 0) {
      setGameOver(true);
      setMoleIndex(null);
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      if (nextMoleTimerRef.current) clearTimeout(nextMoleTimerRef.current);
    }
  }, [timeLeft, gameStarted]);
  
  // Mole appears randomly
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const spawnMole = () => {
        const newIndex = Math.floor(Math.random() * 9);
        setMoleIndex(newIndex);
        setWhackedIndex(null);
        
        // Clear any existing timer
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        
        // Set timer to hide mole if not whacked
        moleTimerRef.current = setTimeout(() => {
          if (moleIndex === newIndex) { // If same mole is still showing (not whacked)
            setMoleIndex(null);
            setMissedHits(prev => prev + 1); // Count as missed
            
            // Schedule next mole after the hide time delay
            if (nextMoleTimerRef.current) clearTimeout(nextMoleTimerRef.current);
            nextMoleTimerRef.current = setTimeout(spawnMole, moleHideTime);
          }
        }, moleStayTime);
      };
      
      // Start spawning moles
      if (!moleIndex && !nextMoleTimerRef.current) {
        spawnMole();
      }
      
      return () => {
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        if (nextMoleTimerRef.current) clearTimeout(nextMoleTimerRef.current);
      };
    }
  }, [gameOver, gameStarted, moleStayTime, moleHideTime, moleIndex]);
  
  // Player struggle detection & hint system
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // If player misses 3 moles in a row or no hits for 10 seconds
      const noHitsDuration = Date.now() - (lastScoreTime || Date.now());
      if (missedHits >= 3 || noHitsDuration > 10000) {
        setShowHint(true);
        // Clear hint after 3 seconds
        if (hintRef.current) clearTimeout(hintRef.current);
        hintRef.current = setTimeout(() => setShowHint(false), 3000);
        
        // Reset missed hits counter
        setMissedHits(0);
      }
      
      // Show encouragement when score is low but time is running out
      if (timeLeft < 10 && score < 30 && !showEncouragement) {
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 3000);
      }
    }
    
    return () => {
      if (hintRef.current) clearTimeout(hintRef.current);
    };
  }, [missedHits, gameStarted, gameOver, lastScoreTime, timeLeft, score, showEncouragement]);
  
  // Handle mole hit
  const handleHit = (index) => {
    if (!gameStarted || gameOver) return;
    
    setHammerHit(true); // Hammer animation
    setTimeout(() => setHammerHit(false), 150);
    
    if (index === moleIndex) {
      // Hit success!
      setScore((prev) => prev + pointsPerHit);
      setWhackedIndex(index); // Show whacked mole
      setMoleIndex(null); // Hide normal mole
      setLastScoreTime(Date.now()); // Record time of successful hit
      setMissedHits(0); // Reset missed hits counter
      
      // Clear any existing mole timer
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
      if (nextMoleTimerRef.current) clearTimeout(nextMoleTimerRef.current);
      
      // Show whacked mole briefly then spawn next mole
      setTimeout(() => {
        setWhackedIndex(null); // Hide whacked mole after short time
        
        // Spawn next mole after the hide time delay
        nextMoleTimerRef.current = setTimeout(() => {
          const nextIndex = Math.floor(Math.random() * 9);
          setMoleIndex(nextIndex);
          
          // Set timer for this new mole
          moleTimerRef.current = setTimeout(() => {
            if (moleIndex === nextIndex) {
              setMoleIndex(null);
              setMissedHits(prev => prev + 1);
              
              // Schedule next mole
              nextMoleTimerRef.current = setTimeout(() => {
                if (gameStarted && !gameOver) {
                  spawnMole();
                }
              }, moleHideTime);
            }
          }, moleStayTime);
        }, moleHideTime);
      }, 300);
    } else {
      // Missed hit (clicked wrong hole)
      setMissedHits(prev => prev + 1);
    }
  };
  
  // Helper function to spawn a mole
  const spawnMole = () => {
    const newIndex = Math.floor(Math.random() * 9);
    setMoleIndex(newIndex);
    
    // Set timer to hide mole
    moleTimerRef.current = setTimeout(() => {
      setMoleIndex(null);
      setMissedHits(prev => prev + 1);
      
      // Schedule next mole
      nextMoleTimerRef.current = setTimeout(spawnMole, moleHideTime);
    }, moleStayTime);
  };
  
  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    applyDifficultySettings(newDifficulty);
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
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden relative cursor-none"
         style={{
           backgroundImage: 'linear-gradient(#f5f5f5 1px, transparent 1px), linear-gradient(90deg, #f5f5f5 1px, transparent 1px)',
           backgroundSize: '20px 20px',
           backgroundColor: '#ffffff'
         }}>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-orange-500 rounded-full z-0"></div>
      <div className="absolute bottom-20 left-20 w-24 h-12 bg-green-500 rounded-tl-full rounded-tr-full z-0"></div>
      <div className="absolute top-20 right-20 w-20 h-20 bg-purple-500"
           style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-red-500 rounded-full z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, transparent 0%, transparent 60%, #000 61%, #000 100%)' }}></div>
      
      {/* Game title */}
      <div className="absolute top-4 w-full text-center z-10">
        <h1 className="text-5xl font-black mb-2" style={{ fontFamily: 'Impact, fantasy' }}>
          <span className="text-orange-500">WHACK</span>
          <span className="text-purple-600">•A•</span>
          <span className="text-orange-500">MOLE</span>
        </h1>
      </div>
      
      {/* Score & Timer */}
      <div className="absolute top-20 border-4 border-black p-4 bg-white rounded-lg z-10 shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
        <h3 className="text-2xl font-bold">Score: <span className="text-purple-600">{score}</span></h3>
        <h3 className="text-2xl font-bold">Time: <span className="text-purple-600">{timeLeft}</span> sec</h3>
        <div className="mt-2 text-sm">Difficulty: 
          <span className={`ml-2 px-2 py-1 rounded ${
            difficulty === "easy" ? "bg-green-500" : 
            difficulty === "medium" ? "bg-yellow-500" : "bg-red-500"
          } text-white font-bold`}>
            {difficulty.toUpperCase()}
          </span>
        </div>
        <div className="mt-1 text-sm">Points per hit: <span className="font-bold">{pointsPerHit}</span></div>
        <div className="mt-1 text-sm">Mole speed: 
          <span className="font-bold ml-1">
            {difficulty === "easy" ? "Slow" : difficulty === "medium" ? "Medium" : "Fast"}
          </span>
        </div>
      </div>
      
      {/* Hint system */}
      {showHint && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 border-2 border-black p-3 rounded-lg z-30 shadow-lg animate-bounce">
          <div className="text-lg font-bold">Hint: Watch for moles and click quickly!</div>
          {moleIndex !== null && (
            <div className="text-sm mt-1">A mole is visible right now! 👀</div>
          )}
        </div>
      )}
      
      {/* Encouragement message */}
      {showEncouragement && (
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white border-2 border-black p-3 rounded-lg z-30 shadow-lg">
          <div className="text-lg font-bold">You can do it! Try clicking faster!</div>
        </div>
      )}
      
      {/* Welcome screen */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white border-4 border-black bg-opacity-90 text-black p-6 rounded-lg z-20 shadow-2xl">
          <h1 className="text-6xl font-bold mb-8" style={{ fontFamily: 'Impact, fantasy' }}>
            <span className="text-black">BUILD YOUR</span><br/>
            <span className="text-orange-500">MOLE TEAM</span>
          </h1>
          <p className="text-xl mb-6 text-center max-w-md">Whack as many moles as you can in 30 seconds!</p>
          
          {/* Difficulty selection with point info */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => changeDifficulty("easy")}
              className={`px-4 py-2 border-2 border-black rounded-full transition-all ${
                difficulty === "easy" ? "bg-green-500 text-white" : "bg-white text-black hover:bg-green-200"
              }`}
            >
              Easy (10 pts)
            </button>
            <button 
              onClick={() => changeDifficulty("medium")}
              className={`px-4 py-2 border-2 border-black rounded-full transition-all ${
                difficulty === "medium" ? "bg-yellow-500 text-white" : "bg-white text-black hover:bg-yellow-200"
              }`}
            >
              Medium (15 pts)
            </button>
            <button 
              onClick={() => changeDifficulty("hard")}
              className={`px-4 py-2 border-2 border-black rounded-full transition-all ${
                difficulty === "hard" ? "bg-red-500 text-white" : "bg-white text-black hover:bg-red-200"
              }`}
            >
              Hard (20 pts)
            </button>
          </div>
          
          <div className="bg-yellow-100 border-2 border-yellow-500 p-3 rounded-lg mb-6 max-w-md">
            <p className="text-sm text-center">
              <strong>Easy:</strong> Slow moles (3s), 10 points per hit<br/>
              <strong>Medium:</strong> Medium speed (2s), 15 points per hit<br/>
              <strong>Hard:</strong> Fast moles (1.2s), 20 points per hit
            </p>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-black text-2xl tracking-wider border-2 border-black text-white rounded-full transition-all duration-300 hover:bg-purple-600"
            style={{ fontFamily: 'Impact, fantasy' }}
          >
            START GAME
          </button>
        </div>
      )}
      
      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-6 w-[400px] h-[400px] z-10 mt-32">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`hole w-28 h-28 rounded-lg shadow-lg relative overflow-hidden flex justify-center items-end ${
              moleIndex === index ? "scale-105 border-dashed" : ""
            }`}
            style={{
              backgroundColor: ['#FF6B6B', '#6B66FF', '#33B249'][index % 3],
              border: `4px ${moleIndex === index ? "dashed" : "solid"} black`,
              transform: `rotate(${Math.floor(Math.random() * 3) - 1}deg)`,
              boxShadow: moleIndex === index && showHint ? "0 0 15px 5px yellow" : "",
            }}
            onClick={() => handleHit(index)}
          >
            {moleIndex === index && (
              <div className="flex justify-center items-end w-full h-full">
                <img
                  src={moleImg}
                  alt="mole"
                  className={`w-[70%] cursor-pointer transition-transform duration-200 ease-in-out ${
                    showHint ? "animate-pulse" : ""
                  }`}
                  style={{ transform: "translateY(10%)" }}
                />
              </div>
            )}
            {whackedIndex === index && (
              <div className="flex justify-center items-end w-full h-full">
                <img
                  src={moleWhackedImg}
                  alt="whacked mole"
                  className="w-[70%] transition-opacity duration-300 opacity-100"
                  style={{ transform: "translateY(10%)" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Game Over screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white border-4 border-black bg-opacity-90 text-black p-6 rounded-lg z-20 shadow-2xl">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-yellow-400 rotate-12 flex items-center justify-center rounded-full border-2 border-black">
            <span className="text-black font-bold text-xl" style={{ fontFamily: 'Impact, fantasy' }}>WOW!</span>
          </div>
          <h3 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Impact, fantasy' }}>GAME OVER!</h3>
          <h1 className="text-6xl font-black mb-8 text-purple-600" style={{ fontFamily: 'Impact, fantasy' }}>SCORE: {score}</h1>
          
          {/* Feedback based on score and difficulty */}
          <div className="mb-6 text-xl text-center max-w-md">
            {difficulty === "easy" ? (
              score < 100 ? (
                <p>Need more practice? Keep trying in Easy mode!</p>
              ) : (
                <p>Great score! Try Medium mode for more challenge!</p>
              )
            ) : difficulty === "medium" ? (
              score < 150 ? (
                <p>Not bad! Keep practicing in Medium mode!</p>
              ) : (
                <p>Awesome score! Ready for Hard mode?</p>
              )
            ) : (
              score < 200 ? (
                <p>Hard mode is tough! Keep at it!</p>
              ) : (
                <p>Amazing skills! You've mastered Hard mode!</p>
              )
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-6 py-3 bg-black text-xl tracking-wider border-2 border-black text-white rounded-full transition-all duration-300 hover:bg-purple-600"
              style={{ fontFamily: 'Impact, fantasy' }}
            >
              PLAY AGAIN
            </button>
            <button
              onClick={() => setGameStarted(false)}
              className="px-6 py-3 bg-white text-xl tracking-wider border-2 border-black text-black rounded-full transition-all duration-300 hover:bg-orange-500 hover:text-white"
              style={{ fontFamily: 'Impact, fantasy' }}
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}
      
      {/* Custom Cursor (Hammer) */}
      <div
        className={`w-[110px] h-[110px] absolute bg-no-repeat bg-contain pointer-events-none transition-transform duration-150 z-50 ${
          showHint && moleIndex !== null ? "animate-pulse" : ""
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