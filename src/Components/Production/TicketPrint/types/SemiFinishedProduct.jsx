import React, {useState} from 'react'


import { Paper, Container, Typography, TextField, Button} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';


export default function SemiFinishedProduct() {
    const originalData = {
        productArticleNumber:       '',
        workOrderNumber:            '',
        quantity:                   '',
        currentProcess:             '',
        createdDate:                '',
        createdBy:                  ''
    }
    const [data, setData] = useState(originalData)


    return(
        <Container sx={{'display': 'flex', 'flexDirection':'column', 'alignItems': 'center', 'justifyContent':'center', 'margin':'0.5rem'}}>
            <Paper sx={{'padding':'0.5rem'}}>
                <Typography
                    variant     = 'h3'
                    textAlign   = 'center'
                    sx          = {{'marginBottom': '3rem'}}
                >
                    Félkésztermék
                </Typography>
                <TextField
                    value       = {data.productArticleNumber}
                    onChange    = {(e) => (setData({...data, productArticleNumber: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Késztermék cikkszáma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.workOrderNumber}
                    onChange    = {(e) => (setData({...data, workOrderNumber: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Üzemimegbízás száma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.quantity}
                    onChange    = {(e) => (setData({...data, quantity: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Mennyiség'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.currentProcess}
                    onChange    = {(e) => (setData({...data, currentProcess: e.target.value}))}
                    type        = 'text'
                    variant     = 'outlined'
                    label       = 'Aktuális művelet'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.createdBy}
                    onChange    = {(e) => (setData({...data, createdBy: e.target.value}))}
                    type        = 'text'
                    variant     = 'outlined'
                    label       = 'Kiállította'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.createdDate}
                    onChange    = {(e) => (setData({...data, createdDate: e.target.value}))}
                    type        = 'date'
                    variant     = 'outlined'
                    label       = 'Kiállítás dátuma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
            </Paper>
            <Container sx={{'display': 'flex', 'margin': '2rem', 'alignItems': 'center', 'justifyContent':'space-around'}}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    endIcon={<PrintIcon/>}
                    onClick={(e) => {window.location = 'printerplus://send?text=' + document.getElementById('data').innerHTML}}
                >
                    Nyomtatás
                </Button>
                <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    endIcon={<CancelIcon/>}
                    onClick={(e) => {setData(originalData)}}
                >
                    Adatok törlése
                </Button>
            </Container>
            <span id='data' hidden>
                <h3>Félkésztermék</h3>
                
                <h5>{data.productArticleNumber}</h5>
                <p>Késztermék cikkszáma</p>
                <hr/>

                <h5>{data.workOrderNumber}</h5>
                <p>Üzemimegbízás száma</p>
                <hr/>

                <h5>{data.quantity}</h5>
                <p>Mennyiség</p>
                <hr/>
                
                <h5>{data.currentProcess}</h5>
                <p>Aktuális Művelet</p>
                <hr/>
                
                <h5>{data.createdBy}</h5>
                <p>Kiállította</p>
                <hr/>
                
                <h5>{data.createdDate}</h5>
                <p>Kiállítás dátuma</p>
            </span>
        </Container>
    )
}