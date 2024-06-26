import React, {useState} from 'react'
import { Button, Container} from '@mui/material';


import FinishedProduct from './types/FinishedProduct'
import SemiFinishedProduct from './types/SemiFinishedProduct'
import MultiLevelProduct from './types/MultiLevelProduct'
import MissingMaterial from './types/MissingMaterial'
import MachineSetup from './types/MachineSetup'
import MaterialRequest from './types/MaterialRequest'
import NonConfirmantPart from './types/NonConfirmantPart'


export default function TicketPrint() {
    const [ticketType, setTicketType] = useState('');

    return (
        <Container sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Container sx={{display:'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent:'space-around'}}>
                <Button
                    onClick = {(e) => setTicketType(<FinishedProduct/>)}
                    color   = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Késztermék
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<SemiFinishedProduct/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Félkésztermék
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<MultiLevelProduct/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Lépcsős Késztermék jelölő
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<MissingMaterial/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Alapanyaghiány
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<MachineSetup/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Gépbeállítás igénylő
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<MaterialRequest/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Alapanyag igénylő
                </Button>
                <Button
                    onClick = {(e) => setTicketType(<NonConfirmantPart/>)}
                    color = 'primary'
                    variant = 'contained'
                    sx      = {{margin:'0.25rem'}}
                >
                    Nem megfelelő anyag
                </Button>
            </Container>
            
            {ticketType}         

        </Container>

    )
}