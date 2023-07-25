import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ErrorAccess from "./Error_Access";

const initialValues = {
    bookTitle: '',
    bookAuthor: '',
    bookId: '',
    numberOfBooks: ''
};
const { ethers } = require('ethers');
const provider = new ethers.providers.Web3Provider(window.ethereum);


export default function BookForm(props) {
// State to track user connection status
const [isConnected, setIsConnected] = useState(false);
const [isOwner, setIsOwner] = useState(true);
    // Get the signer from the provider
    const signer = provider.getSigner();
    //console.log(signer);
    const address = props.address;
    console.log(props.contractAddress);
    const contract = new ethers.Contract(props.contractAddress, props.abi, provider);
    const [values, setValues] = useState(initialValues);

useEffect(() => {
  // Check connection status and ownership on component mount
  checkConnectionStatus();
   // Call the function to check ownership when the component mounts
  checkOwnership().then((result) => {
  setIsOwner(result);

  // Add event listener for account changes
  window.ethereum.on('accountsChanged', handleAccountChange);

  // Clean up the event listener on component unmount
  return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  });
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
function handleAccountChange(accounts) {
  // Update isConnected state based on the length of accounts array
  setIsConnected(accounts.length > 0);

  // Check ownership for the new account if available
  if (accounts.length > 0) {
    const account = accounts[0];
    checkOwnership(account).then((result) => {
      setIsOwner(result);
    });
  } else {
    // If no connected account, user is not the owner
    setIsOwner(false);
  }
}
async function checkOwnership() {
  try {
    // Get the connected account address
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      const account = accounts[0];

      // Call the smart contract's owner function to get the owner address
      const owner = await contract.owner();

      // Compare the owner address with the connected account address
      console.log('Owner: ' + owner.toLowerCase());
      console.log('User: ' + account.toLowerCase());
      const isConnectedAccountOwner = ethers.utils.getAddress(owner) === ethers.utils.getAddress(account);
      //console.log(isConnectedAccountOwner);
      console.log('Checking ownership: ')
      console.log(isConnectedAccountOwner);
      return isConnectedAccountOwner;
    }
  } catch (error) {
    console.error('Error checking ownership:', error);
  }
  console.log('User is not the owner')
  // Return false if there was an error or no connected account
  return false;
}


    const handleInputChange = (e) => {
        const {name, value} = e.target;
    
        setValues({
            ...values,
            [name]:value,
        });
    };
    const getBookInfo = async (event) => {
      event.preventDefault();
      if (window.ethereum) {
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
          const readBook = await contract.getBook(values.bookId); // Use await to get the result
          
          console.log(readBook);

          alert(
            "Book Title: " +
            readBook.title +
            " Book Author: " +
            readBook.author +
            " Book Id: " +
            readBook.bookId +
            " Number of Books: " +
            readBook.numberOfBooks
          );
    
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while fetching the book information. Please check if book Id exists');
        }
      } else {
        alert('MetaMask not detected. Please install MetaMask to use this DApp.');
      }
    };
    
      const addBook = async (event) => {
        event.preventDefault();
        if(values.bookTitle !== '' && values.bookAuthor !== '' && values.bookId !== 0 && values.numberOfBooks !== 0) {
          alert("You are adding a book with " + 
          "Book Title: " +
            values.bookTitle +
            " Book Author: " +
            values.bookAuthor +
            " Book Id: " +
            values.bookId +
            " No of Books: " +
            values.numberOfBooks
        );
          if (window.ethereum){
            try {
                  const signer = provider.getSigner();
  
                  //SOS: WE NEED PROVIDER IN CONTRACT TO ACCESS THE OWNER OF THE SMART CONTRACT
                  const contractOwner = new ethers.Contract(props.contractAddress, props.abi, provider);
  
                  const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
                  //console.log(contract);
                  const owner = await contractOwner.owner();
  
  
                  const book = await contract.createBook(values.bookTitle, values.bookAuthor, values.bookId, values.numberOfBooks);
                  console.log('Smart contract owner:', owner);
  
                  await book.wait();
  
                console.log('Setter function called successfully');
  
            } catch (error) {
              console.error("Error:", error);
            }
          }
        } else{
          alert('Please fill all the required fields.')
        }
       
        
      };
      
      return (
        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          {isOwner? ( <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            flexDirection="column"
            alignItems={'center'}
            sx={{
              width: 500,
              margin: "0 auto", // Center the Box horizontally
              border: "0.5px solid #000", // Add outline to the Box
              borderRadius: "10px", // Set rounded corners for the Box
              padding: "20px", // Add padding to the Box for spacing
              paddingTop: "50px",
              paddingBottom: "50px"
            }}
          >
            <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
              <TextField
                label="Book Title"
                name="bookTitle"
                value={values.bookTitle}
                onChange={handleInputChange}
                variant="outlined"
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
              <TextField
                label="Book Author"
                name="bookAuthor"
                value={values.bookAuthor}
                onChange={handleInputChange}
                variant="outlined"
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
              <TextField
                label="Book Id"
                name="bookId"
                value={values.bookId}
                onChange={handleInputChange}
                variant="outlined"
              />
            </FormControl>
            <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
              <TextField
                label="Number of Books"
                name="numberOfBooks"
                value={values.numberOfBooks}
                onChange={handleInputChange}
                variant="outlined"
              />
            </FormControl>
            <Button onClick={addBook} variant="contained" color="primary" sx={{ width: "50%", marginBottom: "10px", borderRadius: 50 }}>
              Add Book
            </Button>
            <Button onClick={getBookInfo} variant="contained" color="secondary" sx={{ width: "50%", borderRadius: 50 }}>
              Get Book Info
            </Button> 
            
          </Box>) : (<ErrorAccess/>)}
          
        </div>
      );
    }
