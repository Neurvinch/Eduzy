
import { ConnectButton } from '@rainbow-me/rainbowkit'
import './App.css'
<<<<<<< HEAD
import Navbar from './components/Navbar';
import Hero from './components/Hero';
=======
import ComeAndStake from './sections/ComeAndStake'
//import RegisterWithStake from './pages/RegisterWithStake'
>>>>>>> 09ff9fdef9ac0124e97dabddd724a7351df8ad49

function App() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
      
     
      </main>
    </div>
  );
=======
    <>
    {/* <RegisterWithStake/> */}
    <ComeAndStake/>
      <ConnectButton/>
    </>
  )
>>>>>>> 09ff9fdef9ac0124e97dabddd724a7351df8ad49
}

export default App;
