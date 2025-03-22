
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ComeAndStake from './sections/ComeAndStake';
import NFTrentAndMint from './sections/NFTrentAndMint';
import MintingToken from './sections/MintingToken';
import TokenSwap from './sections/Token-swap';
import Events from './sections/Events';
import Voting from './sections/Voting';
import LiveStreaming from './sections/LiveStreaming';

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
       <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Hero />} />
        <Route path="/ComeAndStake" element={<ComeAndStake />} />
        <Route path="/NFTrentAndMint" element={<NFTrentAndMint />} />
        <Route path="/MintingToken" element={<MintingToken />} />
        <Route path="/TokenSwap" element={<TokenSwap />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Voting" element={<Voting />} />
        <Route path="/LiveStreaming" element={<LiveStreaming/>} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;


import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ComeAndStake from './sections/ComeAndStake';
import NFTrentAndMint from './sections/NFTrentAndMint';
import MintingToken from './sections/MintingToken';
import TokenSwap from './sections/Token-swap';
import Events from './sections/Events';
import Voting from './sections/Voting';
import Games from './components/GameSelector';
import CoinCatcher from './components/CoinCatcher';
import  WhackAMole from './components/WhackAMole';
import Game2048  from './components/Game2048';


function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
       <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Hero />} />
        <Route path="/ComeAndStake" element={<ComeAndStake />} />
        <Route path="/NFTrentAndMint" element={<NFTrentAndMint />} />
        <Route path="/MintingToken" element={<MintingToken />} />
        <Route path="/TokenSwap" element={<TokenSwap />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Voting" element={<Voting />} />
        <Route path ="/Games" element={<Games/>}/>
        <Route path ="/CoinCatcher" element={<CoinCatcher/>}/>
        <Route path ="/WhackAMole" element={<WhackAMole/>}/>
        <Route path ="/Game2048" element={<Game2048/>}/>
        
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;