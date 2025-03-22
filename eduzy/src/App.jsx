
import { ConnectButton } from '@rainbow-me/rainbowkit'
import './App.css'
import ComeAndStake from './sections/ComeAndStake'
import NFTrentAndMint from './sections/NFTrentAndMint'
//import RegisterWithStake from './pages/RegisterWithStake'

function App() {


  return (
    <>
    {/* <RegisterWithStake/> */}
    <NFTrentAndMint/>
    <ComeAndStake/>
      <ConnectButton/>
    </>
  )
}

export default App
