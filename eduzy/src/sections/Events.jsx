import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers, parseEther } from "ethers"
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
    return new ethers.Contract(event_contract_address, ABI, signer);
  }

  const checkOwner = async () => {
    const contract = await getContract();
    if(!contract || !address) return;
    const owner = await contract.owner();
    setIsOwner(owner.toLowerCase() === address.toLowerCase());
  }

  const handleRegisterUser = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      const tx = await contract.registerUser(username);
      await tx.wait();
      console.log("User registered");
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateEvent = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      const tx = await contract.createEvent(
        eventName,
        eventDescription,
        parseEther(entryFee || "0"),
        isPublic,
        Math.floor(new Date(startTime).getTime() / 1000),
        Math.floor(new Date(endTime).getTime() / 1000),
        maxAttendees || 0
      );
      await tx.wait();
      console.log("Event created");
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  }

  const handleRegisterForEvent = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      // Use the events array to find the selected event based on eventId.
      const selectedEvent = events.find(e => e[0].toString() === eventId);
      const entryFeeWei = selectedEvent ? selectedEvent[3] : 0;
      const tx = await contract.registerForEvent(eventId, {
        value: entryFeeWei
      });
      await tx.wait();
      console.log("Registered for event");
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  }

  const handleRevokeAccess = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      const tx = await contract.revokeAccess(eventId, accessUsername);
      await tx.wait();
      console.log("Access revoked");
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancelEvent = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      const tx = await contract.cancelEvent(eventId);
      await tx.wait();
      console.log("Event cancelled");
      fetchEvents();
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  }

  const fetchEvents = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      // Replace "EventCounts" with a constant value if needed (e.g., 10)
      const eventData = await contract.getAllEvents(0, 10);
      setEvents(eventData.map((e, i) => [i + 1, ...e]));
    } catch (error) {
      console.log(error);
    }
  }

  const fetchNotifications = async () => {
    try {
      const contract = await getContract();
      if(!contract) return;
      const notifs = await contract.getNotifications(address);
      setNotifications(notifs);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  }

  useEffect(() => {
    if(isConnected && address) {
      checkOwner();
      fetchEvents();
      fetchNotifications();
    }
  }, [address, isConnected]);

  return (
    <div className="min-h-screen relative mt-20  mr-[250px] ml-[250px]" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      {/* Decorative elements */}
      <div className="absolute top-20 left-12 w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
        </svg>
      </div>
      
      <div className="absolute top-40 right-16 w-12 h-12">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <h1 className="text-4xl font-black text-center mb-8">EVENT MANAGEMENT <span className="text-pink-400">DApp</span></h1>

        {isConnected && (
          <>
            {/* Register User */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black relative">
              <div className="absolute -top-3 -right-3 bg-yellow-400 w-8 h-8 rounded-"></div>
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">Register User</h2>
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-black  px-4 py-2 flex-1"
                />
                <button 
                  onClick={handleRegisterUser}
                  className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Create Event */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black relative">
              <div className="absolute -top-3 -left-3 bg-orange-500 w-8 h-8 rounded-full"></div>
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Create Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={eventName} 
                  onChange={(e) => setEventName(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <input 
                  type="text" 
                  placeholder="Description" 
                  value={eventDescription} 
                  onChange={(e) => setEventDescription(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <input 
                  type="text" 
                  placeholder="Entry Fee (ETH)" 
                  value={entryFee} 
                  onChange={(e) => setEntryFee(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <div className="flex items-center gap-2 px-4">
                  <label className="flex items-center gap-2 rounded-full cursor-pointer">
                    <span>Public:</span> 
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isPublic} 
                        onChange={(e) => setIsPublic(e.target.checked)} 
                        className="sr-only"
                      />
                      <div className={`block w-14 h-8 rounded-full transition ${isPublic ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isPublic ? 'translate-x-6' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <input 
                  type="datetime-local" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <input 
                  type="datetime-local" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <input 
                  type="text" 
                  placeholder="Max Attendees" 
                  value={maxAttendees} 
                  onChange={(e) => setMaxAttendees(e.target.value)} 
                  className="border-2 border-black px-4 py-2"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-black transform translate-x-1 translate-y-1"></div>
                  <button 
                    onClick={handleCreateEvent}
                    className="relative bg-orange-500 text-white font-bold px-8 py-3 rounded- z-10"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>

            {/* Register for Event */}
            <div className="bg-white  p-6 mb-6 shadow-md border-2 border-black">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Register for Event</h2>
              <div className="flex flex-wrap gap-4">
                <input 
                  type="text" 
                  placeholder="Event ID" 
                  value={eventId} 
                  onChange={(e) => setEventId(e.target.value)} 
                  className="border-2 border-black  px-4 py-2 flex-1"
                />
                <button 
                  onClick={handleRegisterForEvent}
                  className="bg-green-500 text-white font-bold px-6 py-2  hover:bg-green-600 transition-colors"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Manage Access */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black">
              <h2 className="text-2xl font-bold mb-4 text-purple-600">Manage Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Event ID" 
                  value={eventId} 
                  onChange={(e) => setEventId(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={accessUsername} 
                  onChange={(e) => setAccessUsername(e.target.value)} 
                  className="border-2 border-black  px-4 py-2"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleGrantAccess}
                  className="bg-purple-600 text-white font-bold px-6 py-2  hover:bg-purple-700 transition-colors"
                >
                  Grant Access
                </button>
                <button 
                  onClick={handleRevokeAccess}
                  className="bg-red-500 text-white font-bold px-6 py-2  hover:bg-red-600 transition-colors"
                >
                  Revoke Access
                </button>
              </div>
            </div>

            {/* Cancel/Refund Event */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Cancel/Refund Event</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Event ID" 
                  value={eventId} 
                  onChange={(e) => setEventId(e.target.value)} 
                  className="border-2 border-black  px-4 py-2 flex-1"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleCancelEvent}
                  className="bg-red-500 text-white font-bold px-6 py-2  hover:bg-red-600 transition-colors"
                >
                  Cancel Event
                </button>
                <button 
                  onClick={handleRefundEvent}
                  className="bg-yellow-400 text-black font-bold px-6 py-2  hover:bg-yellow-500 transition-colors"
                >
                  Refund Event
                </button>
              </div>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Events</h2>
              {events.length > 0 ? (
                <ul className="space-y-2">
                  {events.map((event, index) => (
                    <li key={index} className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <strong className="text-blue-700">ID: {event[0]}</strong> | 
                      <span> Name: {event[1]}</span> | 
                      <span> Fee: {ethers.formatEther(event[3])} ETH</span> | 
                      <span> Public: {event[4] ? 
                        <span className="text-green-600 font-bold">Yes</span> : 
                        <span className="text-red-600 font-bold">No</span>}</span> | 
                      <span> Start: {new Date(Number(event[6]) * 1000).toLocaleString()}</span> | 
                      <span> Cancelled: {event[8] ? 
                        <span className="text-red-600 font-bold">Yes</span> : 
                        <span className="text-green-600 font-bold">No</span>}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center p-4 bg-gray-100 rounded-lg">No events available</p>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-black relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-400 rounded-full opacity-50"></div>
              <h2 className="text-2xl font-bold mb-4 text-pink-600">Notifications</h2>
              {notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notif, index) => (
                    <li key={index} className="p-3 bg-pink-50 rounded-lg border-2 border-pink-200">
                      {notif}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center p-4 bg-gray-100 rounded-lg">No notifications</p>
              )}
            </div>

            {/* Owner Controls */}
            {isOwner && (
              <div className="bg-black rounded-lg p-6 mb-6 shadow-md text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 opacity-10">
                    <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Owner Controls</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={handlePause}
                    className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors"
                  >
                    Pause Contract
                  </button>
                  <button 
                    onClick={handleUnpause}
                    className="bg-green-500 text-white font-bold px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                  >
                    Unpause Contract
                  </button>
                  <button 
                    onClick={handleWithdrawFunds}
                    className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Purple band */}
      <div className="bg-indigo-600 py-2 relative overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          <span className="text-lg text-pink-200 mx-4">CREATE EVENTS • REGISTER USERS • MANAGE ACCESS</span>
          <div className="w-6 h-6 mx-4 bg-pink-300 rounded-full"></div>
          <span className="text-lg text-pink-200 mx-4">BLOCKCHAIN POWERED • SECURE • DECENTRALIZED</span>
        </div>
      </div>
    </div>
  )
}

export default Events;
