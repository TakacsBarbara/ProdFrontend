import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import { Card, CardActionArea, CardContent, Icon, Typography } from '@mui/material';
import './../../App.css';

export default function DashboardCard({ application }) {
    const navigate = useNavigate();
    const {width} = useWindowDimensions();

    return (
        <>
            <Card
                sx={{
                    margin: '1rem',
                    width: width > 1200 ? '15vw' : '70vw',
                    height: width > 1200 ? '10rem' : '5rem',
                    backgroundColor: '#e8e9eb',
                    boxShadow: '2px 2px 10px #a0a2a3',
                }}
            >
                <CardActionArea
                    onClick = {(e) => {navigate(application.path)}}
                    sx={{
                        width: '100%',
                        height: '100%',
                        margin: '0'
                    }}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: width > 1200 ? 'column' : 'row',
                            alignItems: 'center',
                            justifyContent: width > 600 ? 'space-between' : 'center'
                        }}
                    >
                        <Icon className='dashboard-card-icon'>
                            {application.icon}
                        </Icon>
                        <Typography className='dashboard-card-text' variant="h5" sx={{fontSize:  (width > 1200 && width < 1501) ? '1.4em' : '1.5rem'}}>
                            {application.title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}