import React from 'react'
import { Box, Grid } from "@mui/material"
import { } from "@mui/icons-material"
import Login from '../componet/Login'
import Img from '../componet/Img'



export default function Main() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>

                    <Grid item  xs={12} md={6}  >
                        <Login />
                    </Grid>

                    <Grid item xs={12} md={6} >
                        <Img />
                    </Grid>

                </Grid>
            </Box>
        </>
    )
}
