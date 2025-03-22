import React, { useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import {ethers, parseEther} from "ethers"
import ABI from "../ABI/events.json"
import { event_contract_address } from '../contract_address/events'

const Events = () => {
    const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [username, setUsername] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eventId, setEventId] = useState('');
  const [accessUsername, setAccessUsername] = useState('');
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const getContract = async () => {
    if(!walletClient) return null;

    const provider = new ethers.BrowserProvider(walletClient);
    const signer = await provider.getSigner();
    return new ethers.Contract(event_contract_address, ABI , signer) ;
  }
  const checkOwner = async () => {
    const contract = await getContract();
    if(!contract || !address) return;
    const owner = await contract.owner();
    setIsOwner(owner.toLowerCase() === address.toLowerCase());
  }

  const handleRegisterUser = async  () =>{
    try {
        const contract = await getContract();
        if(!contract) return;

        const tx = await contract.registerUser(username);
        await tx.wait();
        console.log("User registered")
        
    } catch (error) {
        console.log(error)
    }
  }

  const handleCreateevnt = async () => {
    try {
        const contract = await getContract();
        if(!contract) return;

        const tx = await contract.createEvent(
            eventName,
            eventDescription,
            parseEther(entryFee || "0"),
            isPublic,
            math.floor(new Date(startTime).getTime() / 1000),
            math.floor(new Date(endTime).getTime() / 1000),
            maxAttendees || 0
        );
        await tx.wait();
        console.log("Event created")
        fetchEvents();

        
    } catch (error) {
        console.log(error)
    }
     const handleRegisterForEvent = async () =>{
        try {
            const contract = await getContract();
            if(!contract) return;

            const event = event.find(e => e[0] === eventId);
            const entryFeeWei = event ? event[2] : 0;
            const tx = await contract.registerForEvent(eventId, {
                value: entryFeeWei
            });
            await tx.wait();
            console.log("Registered for event");
            
        } catch (error) {
            console.log(error)
        }
     }
   }

   const handleGrantAccess = async () => {
    try {
        const contract = await getContract();
        if(!contract) return;

        const tx = await contract.grantAccess(eventId, accessUsername);
        await tx.wait();
        console.log("Access granted");
         fetchNotifications();
        
    } catch (error) {
         console.log(error)
    }
   }

    const handleRevokeAccess = async () =>{
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.revokeAccess(eventId, accessUsername);
            await tx.wait();
            console.log("Access revoked");
             fetchNotifications();
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleCAncelEvent = async () => {
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.cancelEvent(eventId);
            await tx.wait();
            console.log("Event cancelled");
             fetchEvents();

            
        } catch (error) {
            console.log(error)
        }
    }

    const handleRefundEvent = async () => {
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.refundEvent(eventId);
            await tx.wait();
            console.log("Event refunded");
             
            
        } catch (error) {
             console.log(error)
        }
    }

     const fetchEvents = async () => {
        try {
            const contract = await getContract();
            if(!contract) return;

            const eventData = await contract.getAllEvents(0,EventCounts || 10);
            setEvents(eventData.map( (e,i) => [i +1,...e]));
            
        } catch (error) {
             console.log(error)
        }
     }


     const fetchNotifications = async () =>{
        try {
            const contract = await getContract();
            if(!contract) return;

            const notifs = await contract.getNotifications(address);
            setNotifications(notifs);
            
        } catch (error) {
             console.log(error)
        }
     }

     const handleUnpause = async () => {
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.unpause();
            await tx.wait();
            console.log("Unpaused");
            
        } catch (error) {
             console.log(error)
        }
     }

     const handlePause = async () => {
        try {
          const contract = await getContract();
          if (!contract) throw new Error("Wallet not connected");
    
          const tx = await contract.pause();
          await tx.wait();
          console.log("Contract paused:", tx.hash);
        } catch (error) {
          console.error("Pause failed:", error);
        }
      };
      
      const handleWithdrawFunds = async () => {
        try {
            const contract = await getContract();
            if(!contract) return;

            const tx = await contract.withdrawFunds();
            await tx.wait();
            console.log("Funds withdrawn");
        } catch (error) {
            console.log(error)
        }
    }
       
      useEffect( () =>{
        if(isConnected && address ) {
            checkOwner();
            fetchEvents();
            fetchNotifications();
        }
      },[address , isConnected])
  return (
    <div>
    <h1>Event Management DApp</h1>
   

    {isConnected && (
      <>
        {/* Register User */}
        <div>
          <h2>Register User</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleRegisterUser}>Register</button>
        </div>

        {/* Create Event */}
        <div>
          <h2>Create Event</h2>
          <input type="text" placeholder="Name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          <input type="text" placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
          <input type="text" placeholder="Entry Fee (ETH)" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
          <label>
            Public: <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          </label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          <input type="text" placeholder="Max Attendees" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} />
          <button onClick={handleCreateEvent}>Create Event</button>
        </div>

        {/* Register for Event */}
        <div>
          <h2>Register for Event</h2>
          <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          <button onClick={handleRegisterForEvent}>Register</button>
        </div>

        {/* Manage Access */}
        <div>
          <h2>Manage Access</h2>
          <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          <input type="text" placeholder="Username" value={accessUsername} onChange={(e) => setAccessUsername(e.target.value)} />
          <button onClick={handleGrantAccess}>Grant Access</button>
          <button onClick={handleRevokeAccess}>Revoke Access</button>
        </div>

        {/* Cancel/Refund Event */}
        <div>
          <h2>Cancel/Refund Event</h2>
          <input type="text" placeholder="Event ID" value={eventId} onChange={(e) => setEventId(e.target.value)} />
          <button onClick={handleCancelEvent}>Cancel Event</button>
          <button onClick={handleRefundEvent}>Refund Event</button>
        </div>

        {/* Events List */}
        <div>
          <h2>Events</h2>
          {events.length > 0 ? (
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  ID: {event[0]} | Name: {event[1]} | Fee: {ethers.formatEther(event[3])} ETH | 
                  Public: {event[4] ? "Yes" : "No"} | Start: {new Date(Number(event[6]) * 1000).toLocaleString()} | 
                  Cancelled: {event[8] ? "Yes" : "No"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events available</p>
          )}
        </div>

        {/* Notifications */}
        <div>
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif, index) => (
                <li key={index}>{notif}</li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </div>

        {/* Owner Controls */}
        {isOwner && (
          <div>
            <h2>Owner Controls</h2>
            <button onClick={handlePause}>Pause Contract</button>
            <button onClick={handleUnpause}>Unpause Contract</button>
            <button onClick={handleWithdrawFunds}>Withdraw Funds</button>
          </div>
        )}
      </>
    )}
  </div>
  )
}

export default Events