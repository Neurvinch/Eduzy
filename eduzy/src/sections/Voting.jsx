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

   const handlePoll = async () => {
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

   const handleCancelPool = async () => {
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
    <div>
      <h1>VotingSide DApp</h1>
      

      {isConnected && (
        <>
          <div>
            <h2>Token Info</h2>
            <p>EXT Balance: {tokenBalance ? `${tokenBalance} EXT` : "Loading..."}</p>
            <p>Vote Cost: {voteCost ? `${voteCost} EXT` : "Loading..."}</p>
          </div>

          {/* Create Poll */}
          <div>
            <h2>Create Poll</h2>
            <input type="text" placeholder="Question" value svil={question} onChange={(e) => setQuestion(e.target.value)} />
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
              />
            ))}
            <button onClick={() => setOptions([...options, ''])}>Add Option</button>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <button onClick={handleCreatePoll}>Create Poll</button>
          </div>

          {/* Vote */}
          <div>
            <h2>Vote</h2>
            <input type="text" placeholder="Poll ID" value={pollId} onChange={(e) => setPollId(e.target.value)} />
            <input type="text" placeholder="Option Index" value={optionIndex} onChange={(e) => setOptionIndex(e.target.value)} />
            <button onClick={handleApprove}>Approve Tokens</button>
            <button onClick={handleVote}>Vote</button>
            <button onClick={fetchPollResults}>View Results</button>
          </div>

          {/* Cancel Poll */}
          <div>
            <h2>Cancel Poll</h2>
            <input type="text" placeholder="Poll ID" value={pollId} onChange={(e) => setPollId(e.target.value)} />
            <button onClick={handleCancelPoll}>Cancel Poll</button>
          </div>

          {/* Owner Functions */}
          {isOwner && (
            <>
              <div>
                <h2>Update Vote Cost</h2>
                <input type="text" placeholder="New Vote Cost (EXT)" value={newVoteCost} onChange={(e) => setNewVoteCost(e.target.value)} />
                <button onClick={handleUpdateVoteCost}>Update</button>
              </div>
              <div>
                <h2>Withdraw Tokens</h2>
                <input type="text" placeholder="Amount (EXT)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                <button onClick={handleWithdrawTokens}>Withdraw</button>
              </div>
            </>
          )}

          {/* Polls List */}
          <div>
            <h2>Polls</h2>
            {polls.length > 0 ? (
              <ul>
                {polls.map(poll => (
                  <li key={poll.id}>
                    ID: {poll.id} | Question: {poll.question} | 
                    Start: {new Date(Number(poll.startTime) * 1000).toLocaleString()} | 
                    End: {new Date(Number(poll.endTime) * 1000).toLocaleString()} | 
                    Status: {PollStatus[poll.status]}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No polls available</p>
            )}
          </div>

          {/* Poll Results */}
          <div>
            <h2>Poll Results (Poll ID: {pollId || 'N/A'})</h2>
            {results ? (
              <ul>
                {results.options.map((opt, index) => (
                  <li key={index}>{opt}: {results.votes[index]} votes</li>
                ))}
              </ul>
            ) : (
              <p>No results available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const PollStatus = ["PENDING", "ACTIVE", "ENDED", "CANCELLED"];
  

export default Voting