import React from 'react'
import MyToolbar from './MyToolbar'
import './style.css'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {useState, useEffect} from 'react';

function LandingPage(props) {
  // State to track user connection status
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  async function checkConnectionStatus() {
    if (window.ethereum) {
      try {
        // Check if the user is already connected (has authorized accounts)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setIsConnected(accounts.length > 0);
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    }
  }
  async function connect() {
    if (window.ethereum) {
      console.log('MetaMask detected');
      try {
        // Check if the user is already connected (has authorized accounts)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  
        if (accounts.length > 0) {
          // User is already connected, accounts array will contain the connected account(s)
          console.log('User is already connected');
  
          // Get the user's address from MetaMask
          const userAddress = accounts[0];
  
          // Get the owner's address from the smart contract
          const contract = new window.ethers.Contract(props.contractAddress, props.abi, window.ethereum);
          const contractOwner = await contract.getOwner();
  
          // Check if the user's address matches the smart contract owner's address
          if (userAddress.toLowerCase() === contractOwner.toLowerCase()) {
            console.log('User is the owner of the smart contract');
            alert('You are the owner of the smart contract.');
          } else {
            console.log('User is not the owner of the smart contract');
            alert('You are not the owner of the smart contract.');
          }
  
          setIsConnected(true);
        } else {
          // User is not connected, prompt for connection
          console.log('User is not connected');
          const connectedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log('Connected accounts:', connectedAccounts);
          setIsConnected(true);
          alert('Connected Successfully. Please reload to access all functions');
        }
      } catch (error) {
        console.error('Error connecting:', error);
        alert('Error connecting');
      }
    } else {
      console.log('MetaMask not detected');
      alert('MetaMask not detected');
    }
  }
  return (
    <div className='container'>
      <Typography color={'#FFFF'} variant='body2' letterSpacing={3}>WELCOME TO BOOK CHAIN</Typography>
      <Typography variant="h1" paddingTop={3} align='center' color={"#FFFF"} fontWeight={'bold'}>Empowering Transparent Book Supply Chains</Typography>
      <Typography variant="caption" paddingTop={5} align='center' color={"#FFFF"} fontWeight={'bold'}>Explore the Future of Book Distribution and Tracking with Blockchain Technology</Typography>
      
      <div style={{ marginTop: '30px' }}>
        {!isConnected && (
          <Button variant="contained" style={{ borderRadius: '50px'}} onClick={connect}>Connect </Button> )}
      </div>
    </div>
  )
}

export default LandingPage