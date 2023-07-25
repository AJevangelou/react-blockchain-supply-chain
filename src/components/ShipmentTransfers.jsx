import React from 'react'
import { useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Typography } from '@mui/material';
import Button from "@mui/material/Button";
const { ethers } = require('ethers');

const initialValues = {
    shipmentId: ''
};
           

export default function ShipmentTransfers(props) {
   // Get the provider
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   // Get the signer from the provider
   const signer = provider.getSigner();
   //console.log(signer);
   const address = '0xf803299f1DA7cE221F32bB2b99582225537a54aC';

   const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
   console.log(props.contractAddress);
    const [values, setValues] = useState(initialValues);

    const handleInputChange = (e) => {
    
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };

      const getShipmentInfo = async (event) => {
        event.preventDefault();
      
        if (window.ethereum) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
      
            const shipmentStatus = await contract.getShipmentStatus(values.shipmentId);

            const booktitles = shipmentStatus[6];
            
            let bookLength = booktitles.length; 
            //Create an empty string to store copies of each book
            
            // Create an empty string to store the messages
            let combinedMessage = "";
            const expectedDelivery = shipmentStatus[4];
            const dateOfDeparture = shipmentStatus[3];
            console.log(expectedDelivery);


            // Iterate over the 'booktitles' array
            for (let i = 0; i < bookLength; i++) {
              // Access the 'title' and 'numberOfBooks' properties of each book object
              const title = booktitles[i].title;
              const numberOfBooks = booktitles[i].numberOfBooks;
              
              // Append the title and number of books to the combined message
              combinedMessage += `Title: ${title} - Copies: ${numberOfBooks}\n`;
            }

            if (shipmentStatus[5] === 0){
              alert('Your shipment is at the factory' + combinedMessage + `\n Departure Date: ${dateOfDeparture}` + `\n Expected Delivery: ${expectedDelivery}`);
            } else if (shipmentStatus[5] === 1){
              alert('Your shipment has been shipped from the factory.\n' + combinedMessage + `\n Departure Date: ${dateOfDeparture}` +`\n Expected Delivery: ${expectedDelivery}`);
            }else if (shipmentStatus[5] === 2){
              alert('Your shipment is out for delivery.\n' + combinedMessage + `\n Departure Date: ${dateOfDeparture}` +`\n Expected Delivery: ${expectedDelivery}`);
            }else if (shipmentStatus[5] === 3){
              alert('Your shipment has already been delivered.\n' + combinedMessage + `\n Departure Date: ${dateOfDeparture}` +`\n Expected Delivery: ${expectedDelivery}`);
            }else{
              alert('Check if the shipment with this ID exists');
            }
      
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the shipment information. Please check if the shipment ID exists');
          }
        } else {
          alert('MetaMask not detected. Please install MetaMask to use this DApp.');
        }
      };

      const dispatchFromFactory = async (event) => {
        event.preventDefault();
      
        if (window.ethereum) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
      
            const dispatchFromFactory = await contract.dispatchShipmentFromFactory(values.shipmentId);
            
            alert('Shipment dispatched from factory!')
      
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the shipment information. Please check if the shipment ID exists');
          }
        } else {
          alert('MetaMask not detected. Please install MetaMask to use this DApp.');
        }
      };
      const dispatchFromDelivery = async (event) => {
        event.preventDefault();
      
        if (window.ethereum) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
      
            const dispatchFromDelivery = await contract.dispatchShipmentFromDelivery(values.shipmentId);
            
            alert('Shipment dispatched from delivery hub!')
      
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the shipment information. Please check if the shipment ID exists');
          }
        } else {
          alert('MetaMask not detected. Please install MetaMask to use this DApp.');
        }
      };
      const receivedByCustomer = async (event) => {
        event.preventDefault();
      
        if (window.ethereum) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(props.contractAddress, props.abi, signer);
      
            const receivedByCustomer = await contract.deliveredToBookstore(values.shipmentId);
            
            alert('Shipment received from selling point!')
      
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the shipment information. Please check if the shipment ID exists');
          }
        } else {
          alert('MetaMask not detected. Please install MetaMask to use this DApp.');
        }
      };
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box
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
              paddingBottom: "50px",
            }}
          >
          <Typography variant="h4">Shipment Status</Typography>
    
          <FormControl sx={{ width: '100%', marginBottom: '10px', alignContent:'center', display:'flex', alignItems:'center', marginTop:'10px' }}>
            <TextField
              label="Shipment Id"
              name="shipmentId"
              type="number"
              value={values.shipmentId}
              onChange={handleInputChange}
              variant="outlined"
              sx={{width: '70%'}}
            />
          </FormControl>
          <hr />
    
          <Button variant="contained" onClick={getShipmentInfo} color="secondary" sx={{ width: "50%", height:'50px', marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Get Shipment Info
          </Button>
          <Button variant="contained" onClick={dispatchFromFactory} color="primary" sx={{ width: "50%", height:'50px', marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Dispatch shipment from factory
          </Button>
          <Button variant="contained" onClick={dispatchFromDelivery} color="primary" sx={{ width: "50%", height:'50px', marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Dispatch shipment from delivery hub
          </Button>
          <Button variant="contained" onClick={receivedByCustomer} color="primary" sx={{ width: "50%",  height:'50px',marginBottom: "10px", borderRadius: 50, textTransform:'none' }}>
            Received by selling point
          </Button>
        </Box>
        </div>
      );
    }
