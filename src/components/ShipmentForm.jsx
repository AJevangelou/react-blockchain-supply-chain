import { useState, useEffect } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ErrorAccess from "./Error_Access";



const initialValues = {
    shipmentId: '',
    originAddress: '', 
    deliveryAddress: '', 
    destinationAddress: '', 
    dateOfDeparture: '', 
    expectedArrivalDate: '',
    bookTitle: '',
    bookAuthor: '',
    bookId: '',
    numberOfBooks: '',
};


const { ethers } = require('ethers');
const provider = new ethers.providers.Web3Provider(window.ethereum);
let nextId = 0;
let book = [
    {
      title: "",
      author: "",
      bookId: 0,
      numberOfBooks: 0,
    }
  ];
export default function BookForm(props) {
const [isConnected, setIsConnected] = useState(false);
const [isOwner, setIsOwner] = useState(true);

            // Get the signer from the provider
            const signer = provider.getSigner();
            //console.log(signer);
            const address = '0xf803299f1DA7cE221F32bB2b99582225537a54aC';
            const contract = new ethers.Contract(props.contractAddress, props.abi, signer);

    const [values, setValues] = useState(initialValues);

    console.log(props.contractAddress);
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
    
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };

      const AddBook = async (event) => {
        event.preventDefault();
      
        if(values.bookTitle !== '' && values.bookAuthor !== '' && values.bookId !== 0 && values.numberOfBooks !== 0) {
          // Create a new book entry as an object with properties
          const newBook = {
            title: values.bookTitle,
            author: values.bookAuthor,
            bookId: parseInt(values.bookId),
            numberOfBooks: parseInt(values.numberOfBooks),
          };
              book.unshift(newBook);

          // Increment nextId
          nextId++;

          console.log(nextId);
          console.log(book);
        }else{
          alert('Please fill the required information.');
        }
      };

    const createShipment = async (event) => {
        event.preventDefault();
        try {
              const signer = provider.getSigner();
              book.pop()

             
                const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
                console.log(book)
          // Call the createShipment function in the smart contract
          const tx = await contract.createShipment(
            parseInt(values.shipmentId),
            values.originAddress,
            values.deliveryAddress,
            values.destinationAddress,
            values.dateOfDeparture,
            values.expectedArrivalDate,
            book
          );
      
          // Wait for the transaction to be mined
          await tx.wait();
      
          alert('Shipment created successfully!');
        } catch (error) {
          alert('Error creating shipment:', error);
        }
      }
      
      
    return (
      
      <div>
        {isOwner? (<Box sx={{ padding: '20px',marginLeft:'20px', marginTop:'20px' ,marginRight:'20px' ,border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{alignContent:'center', alignItems:'center', display:'flex', margin:'0 auto', justifyContent:'center' }}>
        <Typography variant="h5">Shipment Creation</Typography>
        </div>
      <Grid container spacing={2}>
        {/* First Column */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ padding: '10px', background: '#f0f0f0', alignContent:'center', display: 'flex', alignItems:'center', flexDirection:'column' }}>
            {/* Content for the first column */}
            <h3>Add books to shipment</h3>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Book Title"
              name="bookTitle"
              type="text"
              value={values.bookTitle}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Book Author"
              name="bookAuthor"
              type="text"
              value={values.bookAuthor}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Book ID"
              name="bookId"
              type="number"
              value={values.bookId}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Number of books"
              name="numberOfBooks"
              type="number"
              value={values.numberOfBooks}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <Button variant="contained" onClick={AddBook} color="primary" sx={{ width: "50%",  height:'50px',marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Add book to shipment
          </Button>
          </Box>
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ padding: '10px', background: '#f0f0f0', alignContent:'center', display: 'flex', alignItems:'center', flexDirection:'column' }}>
            {/* Content for the second column */}
            <h3>Add additional shipment details</h3>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Shipment ID"
              name="shipmentId"
              type="number"
              value={values.shipmentId}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Factory Address"
              name="originAddress"
              type="text"
              value={values.originAddress}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Delivery Hub Address"
              name="deliveryAddress"
              type="text"
              value={values.deliveryAddress}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Destination Address"
              name="destinationAddress"
              type="text"
              value={values.destinationAddress}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Date of Departure"
              name="dateOfDeparture"
              type="text"
              value={values.dateOfDeparture}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Expected Arrival Date"
              name="expectedArrivalDate"
              type="text"
              value={values.expectedArrivalDate}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
            </FormControl>
            <Button variant="contained" onClick={createShipment} color="primary" sx={{ width: "50%",  height:'50px',marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Create Shipment
          </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>) : <ErrorAccess/>}
        
          </div>
    )

}




