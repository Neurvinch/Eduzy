import React,{useEffect, useState} from 'react'
import { useAccount, useWalletClient } from 'wagmi';
 import { ethers, parseEther } from 'ethers';
 import ABI from "../ABI/voting.json"
 import ABITK  from "../ABI/token_creation.json"
 import { voting_contract_address } from '../contract_address/voting';
 import { Token_contract_adddress } from '../contract_address/tokenCreation';
const Voting = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 options
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [pollId, setPollId] = useState('');
  const [optionIndex, setOptionIndex] = useState('');
  const [newVoteCost, setNewVoteCost] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [polls, setPolls] = useState([]);
  const [results, setResults] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [voteCost, setVoteCost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const getContract = async () => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new ethers.Contract(voting_contract_address, ABI, signer);
  };
    const getExclusivetokenContract = async () => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new ethers.Contract(Token_contract_adddress, ABITK, signer);
  };

   const checkOwner = async () => {
     const contract = await getContract();
     if (!contract || !address) return;
     const owner = await contract.owner();
     setIsOwner(owner.toLowerCase() === address.toLowerCase());
   }

   const fetchTokenBalance = async () => {
    try {
        const tokenContract = await getExclusivetokenContract();
        if (!tokenContract || !address) return;
        const bal = await tokenContract.balanceOf(address);
        setTokenBalance(ethers.formatEther(bal));
        
    } catch (error) {
        console.log(error);
    }
   } 

   const fetchVoteCost = async () => {
    try {
        const votingContract = await getContract();
        if (!votingContract || !address) return;
        const cost = await votingContract.voteCost();
        setVoteCost(ethers.formatEther(cost));
        
    } catch (error) {
        console.log(error);
        
    }
   };

   const fetchPolls = async () =>{
    try {
        const votingContract = await getContract();
        if (!votingContract || !address) return;
       
        const count = Number(await votingContract.pollCount());
         const pollArray = [];

         for (let i = 0; i < count; i++) {
            const[question ,startTime ,endTime ,creator ,status] = await votingContract.getPollDetails(i);
            pollArray.push({
                id: i,
                question,
                startTime,
                endTime,
                creator,
                status
                });
         }
         setPolls(pollArray);
    } catch (error) {
        console.log(error);
        
    }
   }

   const handleApprove = async () => {
    try {
        const votingContract = await getContract();
        const tokenContract = await getExclusivetokenContract();
         if (!votingContract || !tokenContract) return;

         const cost = await votingContract.voteCost();
         const tx = await tokenContract.approve(voting_contract_address,cost);
         await tx.wait();
         console.log('Transaction approved');
        
    } catch (error) {
         console.log(error);
    }
   }
   const handleCreatePoll = async () => {
    try {
        const votingContract = await getContract();
        
        if(!votingContract) return;

        const tx = await votingContract.createPoll(
            question,
            options.filter(opt => opt.trim() !== ""),
            Math.floor(new Date(startTime).getTime() / 1000),
             Math.floor(new Date(endTime).getTime() / 1000),
        );
        await tx.wait();
        console.log('Poll created');
        fetchPolls();
    } catch (error) {
         console.log(error);
    }
   }

   const handleVote = async () => {
    try {
        const votingContract = await getContract();
        if(!votingContract) return;

        const tx = await votingContract.vote(pollId, optionIndex);
        await tx.wait();
        console.log('Vote cast');
        fetchTokenBalance();
        fetchPollResults();
        
    } catch (error) {
         console.log(error);
    }
   }

   const handleCancelPoll = async () => {
    try {
        const votingContract = await getContract();
        if(!votingContract) return;
        const tx = await votingContract.cancelPoll(pollId);
        await tx.wait();
        console.log('Poll cancelled');
        fetchPolls();
        
    } catch (error) {
         console.log(error);
    }
   }

   const handleUpdateVoteCost = async () => {
    try {
        const votingContract = await getContract();
        if(!votingContract) return;

        const tx = await votingContract.updateVoteCost(parseEther(newVoteCost));
        await tx.wait();
        console.log('Vote cost updated');
        fetchVoteCost();
        
    } catch (error) {
         console.log(error);
        
    }

   }

    const handleWithdrawTokens = async () => {
        try {
            const votingContract = await getContract();
            if(!votingContract) return;
            const tx = await votingContract.withdrawTokens(parseEther(withdrawAmount));
            await tx.wait();
            console.log('Tokens withdrawn');
            
        } catch (error) {
            console.log(error);
            
        }

    }

    const fetchPollResults = async () => {
        try {
            const votingContract = await getContract();
            if(!votingContract) return;
            const[options , votes] = await votingContract.getPollResults(pollId, 0 ,10);
            setResults({options,votes});
            
        } catch (error) {
            console.log(error);
        }
    }

      useEffect( ()=>{
        if(isConnected && address){
            checkOwner();
            fetchTokenBalance();
            fetchVoteCost();
            fetchPolls();
        }
      },[ isConnected, address]);
  return (
    <div className="relative min-h-screen mt-20" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
  {/* Header */}
  <header className="relative p-6 mb-8">
    <h1 className="text-4xl font-bold text-orange-600">VotingSide DApp</h1>
    
    {/* Decorative elements */}
    <div className="absolute top-8 right-12">
      <svg width="50" height="50" viewBox="0 0 100 100" className="w-16 h-16">
        <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none"></path>
      </svg>
    </div>
  </header>

  {isConnected && (
    <div className="px-6 space-y-8 pb-16  mr-[250px] ml-[250px]">
      {/* Token Info */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-indigo-600 text-white px-4 py-1 rounded-lg font-bold">
          Token Info
        </div>
        <p className="text-lg mt-3 font-medium">EXT Balance: <span className="text-orange-600 font-bold">{tokenBalance ? `${tokenBalance} EXT` : "Loading..."}</span></p>
        <p className="text-lg font-medium">Vote Cost: <span className="text-orange-600 font-bold">{voteCost ? `${voteCost} EXT` : "Loading..."}</span></p>
      </div>

      {/* Create Poll */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-pink-400 text-white px-4 py-1 rounded-lg font-bold">
          Create Poll
        </div>
        <div className="mt-4 space-y-3">
          <input 
            type="text" 
            placeholder="Question" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
          />
          
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
            />
          ))}
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setOptions([...options, ''])}
              className="bg-green-500 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
            >
              Add Option
            </button>
            
            <div className="flex-1 space-y-3">
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
              />
              <input 
                type="datetime-local" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
              />
            </div>
          </div>
          
          <div className="relative mt-4">
            <div className="absolute inset-0 bg-black rounded-full transform translate-x-1 translate-y-1"></div>
            <button 
              onClick={handleCreatePoll}
              className="relative bg-yellow-400 w-full px-6 py-3 rounded-full border-2 border-black font-bold text-black hover:bg-yellow-500 transition-colors"
            >
              Create Poll
            </button>
          </div>
        </div>
      </div>

      {/* Vote */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-orange-500 text-white px-4 py-1 rounded-lg font-bold">
          Vote
        </div>
        <div className="mt-4 space-y-3">
          <input 
            type="text" 
            placeholder="Poll ID" 
            value={pollId} 
            onChange={(e) => setPollId(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
          />
          <input 
            type="text" 
            placeholder="Option Index" 
            value={optionIndex} 
            onChange={(e) => setOptionIndex(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
          />
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleApprove}
              className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
            >
              Approve Tokens
            </button>
            <button 
              onClick={handleVote}
              className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
            >
              Vote
            </button>
            <button 
              onClick={fetchPollResults}
              className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
            >
              View Results
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Poll */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-red-500 text-white px-4 py-1 rounded-lg font-bold">
          Cancel Poll
        </div>
        <div className="mt-4 space-y-3">
          <input 
            type="text" 
            placeholder="Poll ID" 
            value={pollId} 
            onChange={(e) => setPollId(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
          />
          
          <button 
            onClick={handleCancelPoll}
            className="bg-red-500 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            Cancel Poll
          </button>
        </div>
      </div>

      {/* Owner Functions */}
      {isOwner && (
        <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
          <div className="absolute -top-3 -left-3 bg-purple-600 text-white px-4 py-1 rounded-lg font-bold">
            Owner Functions
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Update Vote Cost</h3>
              <input 
                type="text" 
                placeholder="New Vote Cost (EXT)" 
                value={newVoteCost} 
                onChange={(e) => setNewVoteCost(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
              />
              <button 
                onClick={handleUpdateVoteCost}
                className="bg-purple-600 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
              >
                Update
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Withdraw Tokens</h3>
              <input 
                type="text" 
                placeholder="Amount (EXT)" 
                value={withdrawAmount} 
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-0"
              />
              <button 
                onClick={handleWithdrawTokens}
                className="bg-purple-600 text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polls List */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-green-500 text-white px-4 py-1 rounded-lg font-bold">
          Polls
        </div>
        
        <div className="mt-4">
          {polls.length > 0 ? (
            <ul className="space-y-3">
              {polls.map(poll => (
                <li key={poll.id} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-bold">ID: <span className="text-indigo-600">{poll.id}</span></span> | 
                    <span>Question: <span className="font-medium">{poll.question}</span></span> | 
                    <span>Start: <span className="font-medium">{new Date(Number(poll.startTime) * 1000).toLocaleString()}</span></span> | 
                    <span>End: <span className="font-medium">{new Date(Number(poll.endTime) * 1000).toLocaleString()}</span></span> | 
                    <span>Status: <span className="font-medium">{PollStatus[poll.status]}</span></span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4 text-gray-500 italic">No polls available</p>
          )}
        </div>
      </div>

      {/* Poll Results */}
      <div className="bg-white rounded-lg p-5 shadow-md border-2 border-black relative">
        <div className="absolute -top-3 -left-3 bg-blue-500 text-white px-4 py-1 rounded-lg font-bold">
          Poll Results
        </div>
        
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-3">Poll ID: {pollId || 'N/A'}</h3>
          
          {results ? (
            <ul className="space-y-2">
              {results.options.map((opt, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-6 rounded-full flex items-center px-2"
                      style={{ width: `${(results.votes[index] / Math.max(...results.votes) * 100) || 0}%` }}
                    >
                      <span className="text-white text-sm font-medium truncate">{opt}</span>
                    </div>
                  </div>
                  <span className="ml-2 font-bold text-orange-600">{results.votes[index]} votes</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4 text-gray-500 italic">No results available</p>
          )}
        </div>
      </div>
    </div>
  )}
  
  {/* Purple band at bottom */}
  <div className="bg-indigo-600 py-3 fixed bottom-0 w-full left-0">
    <div className="flex items-center justify-center">
      <span className="text-white font-bold">VOTE WITH CONFIDENCE • TRANSPARENT • SECURE</span>
    </div>
  </div>
</div>
  );
}

const PollStatus = ["PENDING", "ACTIVE", "ENDED", "CANCELLED"];
  

export default Voting