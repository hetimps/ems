
import React, { useState } from 'react';
import { Box, Button, Typography, FormControl, FormHelperText, OutlinedInput, InputAdornment, IconButton, FormLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { loginuser, userName } from '../redux/Login_slice';
import { NavLink, useNavigate } from 'react-router-dom';
import { MainString } from '../string/MainString';



export default function Login() {

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState({ email: false, password: false });
    const [data, setdata] = useState({})
    const navigate = useNavigate();



    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    // const login_token = useSelector((state) => state.login_user)

    // console.log(login_token.users);

    // localStorage.setItem("token", JSON.stringify(login_token.users))


    const login_token = useSelector((state) => state.login_user)

    console.log(login_token.users);

    localStorage.setItem("token", JSON.stringify(login_token.users))


    const login_username = useSelector((state) => state.login_user)

    const name = login_username.userName.split('@')[0];

    console.log(name);

    localStorage.setItem("usename", JSON.stringify(name))



    const handlechange = (e) => {

        const name = e.target.name;
        const value = e.target.value;

        setdata({ ...data, [name]: value })
        setErrors({ ...errors, [name]: false });

    }



    // const handleform = (e) => {

    //     e.preventDefault()

    //     // console.log(data);

    //     let formIsValid = true;
    //     const { email, password } = data;
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (!emailRegex.test(email)) {
    //         setErrors((prevErrors) => ({ ...prevErrors, email: true }));
    //         formIsValid = false;
    //     }

    //     if (!password || password.length < 8) { // Added null check for password field
    //         setErrors((prevErrors) => ({ ...prevErrors, password: true }));
    //         formIsValid = false;
    //     }

    //     if (formIsValid) {
    //         const postData = async () => {
    //             try {
    //                 const response = await axios.post(
    //                     'http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/login',
    //                     data
    //                 );

    //                 if (response.data.message === ' login successfully..') {
    //                     toast.success(response.data.message, {
    //                         position: 'top-right',
    //                         theme: 'light',
    //                     });
    //                     navigate("/company")

    //                 } else {
    //                     toast.error(response.data.message, {
    //                         position: 'top-right',
    //                         theme: 'light',
    //                     });
    //                     navigate("/login")
    //                 }


    //                 console.log(response.data.result.email)

    //                 dispatch(userName(response.data.result.email))

    //                 dispatch(loginuser(response.data.token));



    //                 // localStorage.setItem("token", JSON.stringify(response.data.token))

    //                 // console.log('Response:', response);


    //             } catch (error) {
    //                 console.error('Error:', error);
    //             }

    //         };
    //         postData();

    //     }

    // }

    const handleform = (e) => {
        e.preventDefault();

        let formIsValid = true;
        const { email, password } = data;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required' }));
            formIsValid = false;
        } else if (!emailRegex.test(email)) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email address' }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }

        if (!password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password is required' }));
            formIsValid = false;
        } else if (password.length < 8) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters long' }));
            formIsValid = false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }

        if (formIsValid) {
            const postData = async () => {

                try {
                    const response = await axios.post(
                        'http://ec2-52-66-67-174.ap-south-1.compute.amazonaws.com:3107/user/login',
                        data
                    );

                    if (response.data.message === ' login successfully..') {
                        toast.success(response.data.message, {
                            position: 'top-right',
                            theme: 'light',
                        });
                        navigate("/company");
                    } else {
                        toast.error(response.data.message, {
                            position: 'top-right',
                            theme: 'light',
                        });
                        navigate("/login");
                    }

                    console.log(response.data.result.email);
                    dispatch(userName(response.data.result.email));
                    dispatch(loginuser(response.data.token));
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            postData();
        }
    };


    return (

        <form>


            <ToastContainer />
            <Box sm={12}
                className="login">

                <Box className="login_hading">

                    <Typography className="login_hadin_font" variant="h4" component="h4">
                        {MainString.login}
                    </Typography>

                </Box>

                <Box className="login_tital">

                    <Typography className="login_tital_font" variant="p" component="p" >
                        {MainString.tital_login}
                    </Typography>

                </Box>


                <FormControl className='login_form' variant="outlined">

                    {/* <InputLabel className='login_email_lable' htmlFor="outlined-adornment-email">Email</InputLabel> */}
                    <FormLabel>
                        <Typography className="email_lable" variant="h6" component="h6" >
                            {MainString.email_lable}
                        </Typography>
                    </FormLabel>

                    <OutlinedInput
                        placeholder='Enter Email'

                        className='login_email_input'
                        // startAdornment={
                        //     <>

                        //         <MailOutlineIcon className='login_email_icon' />
                        //     </>
                        // }

                        startAdornment={
                            <InputAdornment position="start">
                                <Box className="login_input_bordar"

                                    // display="flex"
                                    // alignItems="center"
                                    // borderRight="1px solid gray"
                                    pr={1}
                                >
                                    <MailOutlineIcon className='login_email_icon' />
                                </Box>
                            </InputAdornment>
                        }
                        id="outlined-adornment-email"
                        name='email'
                        fullWidth
                        value={data.email}
                        error={errors.email}  // Pass the error state for the email field
                        onChange={handlechange}
                        helperText={errors.email}  // Display the error message for the email field
                        autoComplete='off'
                    />



                    {errors.email && (
                        <FormHelperText className='alert_email' error>{errors.email}</FormHelperText>
                    )}

                </FormControl>



                <FormControl variant="outlined" className='login_form_pass'>

                    {/* <InputLabel className='login_password_lable' htmlFor="outlined-adornment-password">Password</InputLabel> */}

                    <FormLabel>
                        <Typography className="password_lable" variant="h6" component="h6" >
                            {MainString.password_lable}
                        </Typography>
                    </FormLabel>

                    <OutlinedInput
                        placeholder='Password'
                        className='login_email_filed'
                        name='password'
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        // startAdornment={
                        //     <KeyIcon className='login_email_password' />


                        // }
                        startAdornment={
                            <InputAdornment position="start">
                                <Box className="login_input_bordar"


                                    pr={1}
                                >
                                    <KeyIcon className='login_email_password' />
                                </Box>
                            </InputAdornment>
                        }
                        autoComplete='off'
                        endAdornment={
                            <InputAdornment className='login_password_show' position="end">
                                <IconButton

                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end">

                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }

                        fullWidth // Set width to 100%

                        value={data.password}
                        onChange={handlechange}
                        error={errors.password} />


                    {errors.password && (
                        <FormHelperText className='alert_password' error>{errors.password}</FormHelperText>
                    )}

                </FormControl>


                <Box
                    className="forgate_box">

                    <Typography variant="p" textAlign="center" sx={{ fontWeight: "500", }}>
                        <NavLink className="login_forgate" to="/forgatpassword" >
                            {MainString.forgot}
                        </NavLink>

                    </Typography>


                </Box>



                <Button variant="contained" className='login_buttons' onClick={handleform} type='submit' disableElevation>
                    {MainString.login_button}
                </Button>



                <Box className="singup_box">


                    <Typography className='login_singup' variant="p" textAlign="center">
                        {MainString.dont_sign}{' '}
                        <NavLink to="/signup" className="signup_link">
                            {MainString.signUp_link}
                        </NavLink>
                    </Typography>

                </Box>


            </Box>
        </form >

    );
}

