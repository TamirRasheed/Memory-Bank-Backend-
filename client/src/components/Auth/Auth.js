import { React, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import {GoogleOAuthProvider, GoogleLogin, googleLogout} from '@react-oauth/google'
import {useDispatch} from 'react-redux'
import {signIn, signUp} from '../../actions/auth.js'
import Input from './Input'
import Icon from './Icon';

import useStyles from './styles';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''}

const Auth = () => {
    const classes = useStyles();
    const state = null;
    const [isSignup, setIsSignup] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const history = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)

        if(isSignup){
            dispatch(signUp(formData, history))
        }
        else{
            dispatch(signIn(formData, history))
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        console.log(res)
    }

    const googleFailure = (error) => {
        console.log(error)
        console.log('Google log in was unsuccessful! Try again later!')
    }


  return (
    <GoogleOAuthProvider 
                    clientId='532898531622-dlsd4kir4s4j24cctpmgfml3cl9mm86l.apps.googleusercontent.com'>
    <Container component="main" maxWidth="xs">
        <Paper className = {classes.paper} elevation = {3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign in'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing = {2}>
                    {
                        isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                        { isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password"/>}
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign in'}
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }
                        <GoogleLogin onSuccess={(response) => console.log(response)}/>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
    </GoogleOAuthProvider>
  )
}
export default Auth;
