
import './App.css'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ComeAndStake from './sections/ComeAndStake';
import NFTrentAndMint from './sections/NFTrentAndMint';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
       <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Hero />} />
        <Route path="/ComeAndStake" element={<ComeAndStake />} />
        <Route path="/NFTrentAndMint" element={<NFTrentAndMint />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
