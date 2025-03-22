import { useHuddle01 ,HuddleProvider } from '@huddle01/react';
import React, { useRef, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoom, useLocalVideo ,useLocalAudio , useLocalScreenShare} from '@huddle01/react';
import { formatEther } from 'ethers';
import { Token_contract_adddress } from '../contract_address/tokenCreation';
import { live_contract_address } from '../contract_address/live';
import ABI from "../ABI/live.json"
import ABITK from "../ABI/token_creation.json"
const LiveStreaming = () => {
    const {address, isConnected} = useAccount();
    const{data : walletClient} = useWalletClient();
    const[showId , setShowId] = useState("");
    const[roomId, setRoomId] = useState("");
    const [hasAccess , setHasAccess] = useState(false);
    const [showFee , setShowFee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const videoRef = useRef(null);
    const{intialize,isInitialized } = useHuddle01();
    const{joinRoom , leaveRoom} = useRoom();
    const { stream: videoStream, enableVideo, disableVideo, isVideoOn } = useLocalVideo();
    const { stream: audioStream, enableAudio, disableAudio, isAudioOn } = useLocalAudio();
    const { startScreenShare, stopScreenShare, shareStream } =
      useLocalScreenShare();

      const getLiveShowContract = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        return new ethers.Contract(live_contract_address, ABI, signer);
    };

      const getTokenContract = async () => {
        if (!walletClient) return null;
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        return new ethers.Contract(Token_contract_adddress, ABITK, signer);
    };


    const fetchShowFee = async () => {
        try {
            const contract = await getLiveShowContract();
            if (!contract || !address) return;
            const show = await contract.liveShows(showId);
            setShowFee(formatEther(show.fee))
            
        } catch (error) {
            console.log(error);
        }
    }

    const approveTokens = async (amount) => {
        try {
            const tokenContract = await getTokenContract();
            if (!contract || !address) return;
            const tx = await tokenContract.approve(live_contract_address, amount);
            await tx.wait();
            setSuccessMessage('Tokens approved'+ tx.hash);
            
        } catch (error) {
            console.log(error);
        }
    }

    const checkAccess = async () => {
        try {
            const contract = await getLiveShowContract();
            if (!contract || !showId) {
                setErrorMessage("Please enter a Show ID");
                return false;
            }
            const access = await contract.checkAccess(showId, address);
            if (!access) {
                const show = await contract.liveShows(showId);
                await approveTokens(show.fee);
                const tx = await contract.payForAccess(showId);
                await tx.wait();
                setSuccessMessage("Access purchased: " + tx.hash);
            }
            return true;
        } catch (error) {
            setErrorMessage("Access denied: " + error.message);
            return false;
        }
    };

    const initializeHuddle = async () => {
        if (!isInitialized) {
            await intialize("ak_rTuZ9yUUnJDnAD2K");
        }
    };

    const joinMeeting = async () => {
        try {
            if (!showId) {
                setErrorMessage("Please enter a Show ID");
                return;
            }
            const accessGranted = await checkAccess();
            if (!accessGranted) return;

            await initializeHuddle();
            const room = `live-show-${showId}`;
            setRoomId(room);
            await joinRoom({ roomId: room });
            await fetchVideoStream();
            await fetchAudioStream();
            setHasAccess(true);
            setSuccessMessage("Joined live show #" + showId);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage("Failed to join meeting: " + error.message);
            setSuccessMessage('');
        }
    };

    const endMeeting = async () => {
        try {
            await stopVideoStream();
            await stopAudioStream();
             leaveRoom();
            setRoomId('');
            setHasAccess(false);
            setSuccessMessage("Meeting ended");
            setErrorMessage('');
        } catch (error) {
            setErrorMessage("Failed to end meeting: " + error.message);
        }
    };

    useEffect(() => {
        if (videoStream && videoRef.current) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    useEffect(() => {
        if (isConnected && showId) {
            fetchShowFee();
        }
    }, [showId, isConnected]);


  return (
    <HuddleProvider>
        <div className="relative min-h-screen bg-gray-100">
                <div className="absolute inset-0 bg-white" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <header className="relative p-4">
                    <h1 className="text-3xl font-bold text-orange-600">Live Streaming Hub</h1>
                </header>
                <main className="relative px-6 pt-8 pb-24">
                    <div className="max-w-lg mx-auto bg-white rounded-xl p-6 border-2 border-black shadow-lg" style={{ boxShadow: '8px 8px 0 rgba(0,0,0,1)' }}>
                        <h2 className="text-4xl font-black text-center mb-2">LIVE STREAMING</h2>
                        <h3 className="text-3xl font-bold text-center text-pink-400 mb-6">WITH HUDDLE01</h3>

                        {!hasAccess ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Live Show ID"
                                    value={showId}
                                    onChange={(e) => setShowId(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg bg-yellow-100"
                                />
                                <p className="text-sm text-gray-600">
                                    Entry Fee: {showFee ? `${showFee} EXT` : "Enter Show ID to see fee"}
                                </p>
                                <button
                                    onClick={joinMeeting}
                                    className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 hover:bg-blue-600 transition-transform"
                                >
                                    JOIN LIVE SHOW
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold">Room: {roomId}</h3>
                                <video ref={videoRef} autoPlay muted className="w-full mt-2 border-2 border-black rounded-lg" />
                                <div className="mt-4">
                                    <h4 className="font-bold">Participants:</h4>
                                    <ul>
                                        {Object.values(peers).map(peer => (
                                            <li key={peer.peerId}>{peer.displayName || peer.peerId} ({peer.role})</li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={endMeeting}
                                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 hover:bg-red-600 transition-transform mt-4"
                                >
                                    END LIVE SHOW
                                </button>
                            </div>
                        )}

                        {errorMessage && <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700"><p>{errorMessage}</p></div>}
                        {successMessage && <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700"><p>{successMessage}</p></div>}
                    </div>
                </main>
            </div>
    </HuddleProvider>
  )
}

export default LiveStreaming