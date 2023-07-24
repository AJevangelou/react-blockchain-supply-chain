import * as React from 'react';
import {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import { IconButton } from '@mui/material';

export default function MyToolbar(props) {
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
    
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ background: '#213E7A' }}>
        <IconButton component={Link} to='/' color='inherit'>
      <BookIcon/>
      </IconButton>
          {/* Add Link buttons on the left side of the toolbar */}
          <Button color="inherit" component={Link} to="/books" disabled={!isConnected} style={{textTransform: 'none'} }>Books</Button>
          <Button color="inherit" component={Link} to="/add-transfer" disabled={!isConnected} style={{textTransform: 'none'}}>Add Shipment</Button>
          <Button color="inherit" component={Link} to="/transfer-status" disabled={!isConnected} style={{textTransform: 'none'}}>Track your shipment</Button>
          <Box sx={{ marginLeft: 'auto' }}>
            {/* Push the Connect button to the right */}
            <Button color="inherit" style={{ textTransform: 'none' }} onClick={connect}>
              {isConnected ? 'Connected' : 'Connect'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}



