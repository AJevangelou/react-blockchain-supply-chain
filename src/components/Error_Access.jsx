import React from 'react'
import './style.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function ErrorAccess() {
  return (
    <div className='error' style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{position: 'absolute', bottom: '150px'}}>
        <Typography variant='h2' color={'#FFFF'}>Looks like you landed on the wrong page</Typography>
      </div>

      <div style={{ position: 'absolute', bottom: '80px' }}>
        <Button component={Link} to="/" variant="contained" style={{ borderRadius: '50px' }}>Go Back</Button> 
      </div>
    </div>
  );
}

export default ErrorAccess