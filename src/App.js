import './App.css';
import React, { useState, useEffect } from 'react';import {
  BrowserRouter,
  Switch,
  Route,
  Routes,
  Link,
  useRouteMatch,
} from "react-router-dom";
import BookForm from './components/BookForm';
import ShipmentForm from './components/ShipmentForm';
import ShipmentTransfers from './components/ShipmentTransfers';
import LandingPage from './components/LandingPage';
import MyToolbar from './components/MyToolbar';
import ErrorAccess from './components/Error_Access';


function App() {
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
  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "books",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "bookId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfBooks",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "shipments",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "transferId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "origin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "deliveryHub",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "destination",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "dateOfDeparture",
          "type": "string"
        },
        {
          "internalType": "enum SupplyChain.State",
          "name": "shipmentState",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "expectedArrivalDate",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        }
      ],
      "name": "getBook",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "author",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "bookId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "numberOfBooks",
              "type": "uint256"
            }
          ],
          "internalType": "struct SupplyChain.Book",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transferId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_origin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_deliveryHub",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_destination",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_dateOfDeparture",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_expectedArrivalDate",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "author",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "bookId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "numberOfBooks",
              "type": "uint256"
            }
          ],
          "internalType": "struct SupplyChain.Book[]",
          "name": "_books",
          "type": "tuple[]"
        }
      ],
      "name": "createShipment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_author",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_numberOfBooks",
          "type": "uint256"
        }
      ],
      "name": "createBook",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transferId",
          "type": "uint256"
        }
      ],
      "name": "deliveredToBookstore",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transferId",
          "type": "uint256"
        }
      ],
      "name": "dispatchShipmentFromDelivery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transferId",
          "type": "uint256"
        }
      ],
      "name": "dispatchShipmentFromFactory",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transferId",
          "type": "uint256"
        }
      ],
      "name": "getShipmentStatus",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "enum SupplyChain.State",
          "name": "",
          "type": "uint8"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "author",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "bookId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "numberOfBooks",
              "type": "uint256"
            }
          ],
          "internalType": "struct SupplyChain.Book[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
  const address = '0x49FA8f837bA23cE5B850f756D78b582B0d4b2Ad8';
  return (
    <BrowserRouter>
    <MyToolbar contractAddress = {address} abi = {abi}/>
      {isConnected ? (
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/books" element={<BookForm contractAddress={address} abi={abi} />} />
          <Route
            path="/transfer-status"
            element={<ShipmentTransfers contractAddress={address} abi={abi} />}
          />
          <Route
            path="/add-transfer"
            element={<ShipmentForm contractAddress={address} abi={abi} />}
          />
        </Routes>
      ) : (
        <div>
          <LandingPage />
          <h3>Please connect to MetaMask to access additional features.</h3>
        </div>
      )}
    </BrowserRouter>
  );
  
};

export default App;
