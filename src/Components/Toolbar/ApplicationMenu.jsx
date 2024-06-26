import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router'

import {Icon, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'

import { UserContext } from '../../Global/UserContext'

import AppsIcon from '@mui/icons-material/Apps';

export default function ApplicationMenu() {
    const navigate = useNavigate()
    const [anchorUserMenu, setAnchorUserMenu] = useState(null)
    const [user, setUser] = useContext(UserContext)

    return(
        <>
            <IconButton
                onClick={(e) => {setAnchorUserMenu(e.currentTarget)}}
                size = 'large'
            >
                <AppsIcon/>
            </IconButton>
            <Menu
                anchorEl        ={anchorUserMenu}
                anchorOrigin    ={{vertical:'top', horizontal: 'right'}}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={Boolean(anchorUserMenu)}
                onClose={(e) => {setAnchorUserMenu(null)}}
            >
                {user.appList.map(application => (
                    <MenuItem key={application.id} onClick = {(e) => {navigate(application.path)}}>
                    <ListItemIcon>
                        <Icon>{application.icon}</Icon>
                    </ListItemIcon>
                    <Typography>
                        {application.title}
                    </Typography>
                </MenuItem> 
                ))} 
            </Menu>
        </>
    )
    
}