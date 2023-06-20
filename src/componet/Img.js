


import { Box } from '@mui/material';

import Logo from '../img/eslogo.png';
import React from 'react';
export default function Img() {
    return (
        <Box
            className="logo_box">
            <img className='logo_img' src={Logo} alt='logo' />
        </Box>
    );
}
