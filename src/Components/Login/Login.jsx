import React, { useContext, useEffect, useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import { UserContext } from '../../Global/UserContext';
import { SelectsContext } from '../../Global/SelectsContext';
import * as UserAPI from '../../API/UserAPI';
import * as ProductionAPI from '../../API/ProductionAPI';
import { Avatar, Container, Paper, Typography, TextField, Button, IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import './../../App.css';

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);
    const [selects, setSelects] = useContext(SelectsContext);
    const userID = useRef('');

    const getSelectsValues = async (e) => {

        const newSelectList = [];
        const selectIds = ['10010', '10011'];
        // 10010 Selejt oka
        // 10011 Utómunka oka
        // 10012 Üzemzavar oka
        // 10013 Megszakítás oka
    
        await Promise.all (
            selectIds.map( async (selectId) => {
                const response = await ProductionAPI.onSelectItemsRequested(selectId);
                newSelectList.push({
                    selectNumber: selectId,
                    selectList: response
                });
            })
        );
        setSelects(newSelectList);
    }

    const handleLogin = async e => {
        const data = await UserAPI.onUserRequestedByID(userID.current.value);

        setUser({...user,
            id: data.userId,
            name: data.userName,
            position: data.position,
            avatarLink: data.foto,
            // logs: data.logs,
            //isLoggedIn: (data.logs !== null && data.logs[data.logs.length - 1].ytkiido === '' ? true : false)
        });

        getSelectsValues();
    }

    return(
        <Container sx={{backgroundColor: '#2c3e50', minWidth: '100vw', minHeight: '100vh', padding: '10vh 10vw 10vh 10vw'}}>
            <Paper
                className='login-container'
                elevation={3}
                sx={{width: '80vw', margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}
            >
                {user.id !== null ? (
                    <React.Fragment>
                        <Typography variant='h3' textAlign='center'>
                            Jelnleg belépve, mint {user.name}.
                        </Typography>
                        <Container sx={{display: 'flex', justifyContent: 'space-around'}}>
                            <Button
                                variant     = 'contained'
                                color       = 'secondary'
                                endIcon     = {<LogoutIcon/>}
                                size        = 'large'
                                sx          = {{width: '20vw', height: '7vh', margin: '1rem', fontSize: '2rem'}}
                            >
                                Kilépés
                            </Button> 
                            <Button
                                variant     = 'contained'
                                color       = 'primary'
                                endIcon     = {<LoginIcon/>}
                                size        = 'large'
                                onClick     = {e => (navigate('/home'))}
                                sx          = {{width: '20vw', height: '7vh', margin: '1rem', fontSize: '2rem'}}
                            >
                                Tovább
                            </Button> 
                        </Container>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Container>
                            <Typography variant='h1' textAlign='center' className='login-title'>
                                Belépés
                            </Typography>
                        </Container>
                        <Avatar
                            className='login-avatar'
                            sx={{width: '20vw', height: '20vw'}}
                        />
                        <TextField
                            className       = 'login-input'
                            autoComplete    = 'off'
                            type            = 'number'
                            label           = 'Törzsszám'
                            color           = 'primary'
                            size            = 'large'
                            inputRef        = {userID}
                            onKeyDown       = { e => (e.key === 'Enter' ? handleLogin() : null)}
                            sx              = {{width: '30vw', marginBottom: '3rem'}}
                            InputProps      = {{
                                endAdornment: (
                                    <IconButton onClick={handleLogin}>
                                        <LoginIcon/>
                                    </IconButton>
                                )
                            }}
                        />
                    </React.Fragment>
                )}
            </Paper>
        </Container>
    )
}