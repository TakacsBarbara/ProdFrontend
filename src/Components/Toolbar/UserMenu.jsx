
import React, {useState, useContext} from 'react'

import {Avatar, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserContext } from '../../Global/UserContext';

export default function UserMenu() {
    const [anchorUserMenu, setAnchorUserMenu] = useState(null)
    const [user, setUser] = useContext(UserContext)

    const handleLogout = () => {
        localStorage.clear()
        window.location.reload(false)
    }


    return(
        <>
            <IconButton
                onClick={(e) => {setAnchorUserMenu(e.currentTarget)}}
            >
                <Avatar src={user.avatarLink} />
            </IconButton>
            <Menu
                anchorEl        ={anchorUserMenu}
                anchorOrigin    ={{vertical:'top', horizontal: 'right'}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={Boolean(anchorUserMenu)}
                onClose={(e) => {setAnchorUserMenu(null)}}
            >
                <MenuItem>
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <Typography>
                        Profilom
                    </Typography>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <Typography>
                        Belállítások
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick = {(e) => {console.log(user)}}
                >
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <Typography>
                        Infó
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={handleLogout}
                >
                    <ListItemIcon>
                        <LogoutIcon color='secondary'/>
                    </ListItemIcon>
                    <Typography color='secondary'>
                        Kijelentkezés
                    </Typography>
                </MenuItem>    
            </Menu>
        </>
            
    )
}