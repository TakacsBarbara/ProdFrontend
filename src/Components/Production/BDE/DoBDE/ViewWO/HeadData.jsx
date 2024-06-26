import React, { useContext } from 'react';
import { Button, Container, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { WorkOrdersContext } from '../../../../../Global/WorkOrdersContext';
import './../../../../../App.css';

export default function HeadData({ WOIndex, handleWOStop, screenW }) {

    const [workOrders, setWorkOrders] = useContext(WorkOrdersContext);

    const desktopStyle = {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '1rem 2rem',
        minWidht: '100%',
        margin: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }

    const mobileStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        minWidht: '100%',
        margin: 'auto',
        flexDirection: 'column',
        flexWrap: 'wrap'
    }

    return(
        <Container className='head-data-container' sx={{ minWidth: '95%', padding: screenW < 680 ? '0 !important' : '0 20px' }}>
            <Container sx={{ padding: screenW < 680 && '0 !important' }}>
                <Typography variant='h4' color='secondary'>
                    {workOrders[WOIndex].workOrderNumber}
                    <Button
                        variant='contained'
                        color='warning'
                        endIcon ={<CancelIcon/>}
                        sx={ screenW < 700 ? {marginLeft: '1rem'} : {marginLeft: '2rem'}}
                        onClick={handleWOStop}
                    >
                        { screenW < 700 ? "Leállítás" : "Megbízás Leállítása" }
                    </Button>
                </Typography>
                <Typography variant='h6' sx={{ marginTop: '5px', fontSize: screenW < 750 && '1.1rem' }}>
                    {workOrders[WOIndex].article} - {workOrders[WOIndex].articleDescription}
                </Typography>
            </Container>
            <Container className='head-data-quantities-container' sx={ screenW < 700 ? mobileStyle : desktopStyle } >
                <Typography variant='subtitle2'>Teljes Mennyiség:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3, fontSize: screenW < 750 && '1.1rem'}} >{workOrders[WOIndex].quantityTotal}</Typography>{' '}</Typography>   
                <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Gyártandó Mennyiség:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3, fontSize: screenW < 750 && '1.1rem'}} >{workOrders[WOIndex].quantityProduced}</Typography>{' '}</Typography>
                <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Kezdési Dátum:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3, fontSize: screenW < 750 && '1.1rem'}} >{workOrders[WOIndex].startDate}</Typography>{' '}</Typography>   
                <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Befejezési Dátum:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3, fontSize: screenW < 750 && '1.1rem'}} >{workOrders[WOIndex].endDate}</Typography>{' '}</Typography>   
            </Container>
            <Container sx={{ padding: screenW < 680 && '0 !important' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '50%', justifyContent: 'space-around', px: 2 }}>
                        <Typography variant="h5" sx={{ color: '#16cc1c' }}>{workOrders[WOIndex].quantities.goodQntyTotal > 0 ? workOrders[WOIndex].quantities.goodQntyTotal : 0}</Typography>
                        <Typography variant="h5" sx={{ color: '#e32014' }}>{workOrders[WOIndex].quantities.badQntyTotal > 0 ? workOrders[WOIndex].quantities.badQntyTotal : 0}</Typography>
                        <Typography variant="h5" sx={{ color: '#f5d714' }}>{workOrders[WOIndex].quantities.reworkQntyTotal > 0 ? workOrders[WOIndex].quantities.reworkQntyTotal : 0}</Typography>
                    </div>
                </div>
            </Container>
        </Container>
    );
}