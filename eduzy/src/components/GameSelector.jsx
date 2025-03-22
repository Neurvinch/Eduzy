import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameSelector = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-white" style={{ 
        backgroundImage: "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Decorative shapes */}
      <div className="absolute top-20 right-20">
        <div className="w-24 h-24 bg-orange-500 rounded-full"></div>
      </div>
      <div className="absolute top-40 left-40">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M10,10 L110,10 L110,110 L10,110 Z" stroke="black" strokeWidth="4" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-32 right-32">
        <div className="w-20 h-20 bg-green-500 rounded-full"></div>
      </div>
      <div className="absolute top-1/4 left-1/4">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="black" strokeWidth="4" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-6xl font-extrabold tracking-tight text-black px-4">
            PLAY TO 
          </h1>
          <div className="bg-pink-400 rounded-lg p-2 px-4 transform rotate-2">
            <span className="text-6xl font-extrabold text-black">EARN</span>
          </div>
        </div>
        <p className="text-xl text-gray-800 max-w-2xl mx-auto mb-8">
          Find the perfect game for your entertainment goals.
        </p>
        <div className="inline-block p-1 bg-yellow-400 rounded-full border-4 border-black shadow-lg transform -rotate-1">
          <div className="bg-white px-4 py-2 rounded-full">
            
          </div>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-lg relative z-10 px-6">
        <GameCard
          title="Treasure Toss"
          description="Catch falling coins to earn rewards"
          image="/assets/coin.png"
          onClick={() => navigate("/coin-catcher")}
          color="bg-orange-400"
          isHovered={hoveredCard === "treasure-toss"}
          setHovered={() => setHoveredCard("treasure-toss")}
          clearHovered={() => setHoveredCard(null)}
        />
        <GameCard
          title="Merge Master"
          description="Combine tiles to reach higher numbers"
          image="/assets/Game2k.png"
          onClick={() => navigate("/2048")}
          color="bg-purple-400"
          isHovered={hoveredCard === "merge-master"}
          setHovered={() => setHoveredCard("merge-master")}
          clearHovered={() => setHoveredCard(null)}
        />
        <GameCard
          title="Smash-a-Mole"
          description="Test your reflexes and earn tokens"
          image="/assets/mole-whacked.png"
          onClick={() => navigate("/whack-a-mole")}
          color="bg-blue-400"
          isHovered={hoveredCard === "smash-a-mole"}
          setHovered={() => setHoveredCard("smash-a-mole")}
          clearHovered={() => setHoveredCard(null)}
        />
      </div>

     

      {/* Footer */}
      <div className="mt-8 text-gray-600 text-sm text-center w-full relative z-10">
        <p>© 2025 Play to Earn Games | All rights reserved</p>
      </div>
    </div>
  );
};

// Redesigned Game Card Component
const GameCard = ({ 
  title, 
  description, 
  image, 
  onClick, 
  color,
  name,
  isHovered, 
  setHovered, 
  clearHovered 
}) => (
  <div
    onClick={onClick}
    onMouseEnter={setHovered}
    onMouseLeave={clearHovered}
    className={`relative rounded-2xl cursor-pointer transition-all duration-300 border-4 border-black shadow-lg overflow-hidden transform ${
      isHovered ? 'scale-105 -rotate-1' : 'rotate-0'
    }`}
    style={{ height: '380px' }}
  >
    {/* Card background */}
    <div className={`absolute inset-0 ${color}`} />
    
    {/* Content */}
    <div className="relative h-full flex flex-col items-center justify-between p-6 z-10">
      {/* Game image */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="relative">
          {isHovered && (
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center transform rotate-12">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
          )}
          <img
            src={image}
            alt={title}
            className="w-40 h-40 object-contain border-4 border-black bg-white rounded-xl shadow-lg"
          />
        </div>
      </div>
      
      {/* Game info */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-black mb-2">{title}</h2>
        <p className="text-black mb-4">{description}</p>
        <div className="flex justify-between items-center">
            <span className="text-white font-bold">{name}</span>
          </div>
          <button 
            className={`py-2 px-6  items-center justify-between rounded-lg font-bold transition-all duration-300 bg-white border-2 border-black shadow-md`}
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  
);

export default GameSelector;