import React from 'react';
import { Paper } from '@mui/material';
import HeadData from './ViewWO/HeadData';
import ToolBar from './ViewWO/Toolbar';
import useWindowDimensions from '../../../../Hooks/useWindowDimensions';

export default function ViewWo({ WOIndex, handleWOStop }) {

    const screen = useWindowDimensions();

    return(
        <Paper 
            elevation={screen.width < 680 ? 0 : 3} 
            sx={{
                margin: '2rem auto', 
                py: screen.width < 680 ? '0' : '40px', 
                width: screen.width < 801 ? '100%' : '80%', 
                minHeight: '600px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-around', 
                alignItems: 'center'
            }} 
        >
            <HeadData WOIndex={WOIndex} handleWOStop={handleWOStop} screenW={screen.width} />
            <ToolBar WOIndex={WOIndex} screenW={screen.width} />
        </Paper>
    );
}