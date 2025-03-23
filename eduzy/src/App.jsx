
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
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
