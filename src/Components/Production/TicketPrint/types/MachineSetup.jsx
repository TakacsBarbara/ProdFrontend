import React, {useState} from 'react'


import { Paper, Container, Typography, TextField, Button} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';


export default function MachineSetup(props) {

    const originalData = {
        productArticleNumber:       '',
        workOrderNumber:            '',
        terminalArticleNumber:      '',
        wireArticleNumber:          '',
        wireCrossSectionMM:         '',
        wireCrossSectionAWG:        '',
        toolNumber:                 '',
        cell:                       '',
        createdTime:                '',
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
                    Gépbeállítás Igény
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
                    value       = {data.terminalArticleNumber}
                    onChange    = {(e) => (setData({...data, terminalArticleNumber: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Terminál cikkszáma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.wireArticleNumber}
                    onChange    = {(e) => (setData({...data, wireArticleNumber: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Vezeték/Kábel cikkszáma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.wireCrossSectionMM}
                    onChange    = {(e) => (setData({...data, wireCrossSectionMM: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Vezeték keresztmettszett [mm]'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.wireCrossSectionAWG}
                    onChange    = {(e) => (setData({...data, wireCrossSectionAWG: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Vezeték keresztmettszett [awg]'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.toolNumber}
                    onChange    = {(e) => (setData({...data, toolNumber: e.target.value}))}
                    type        = 'number'
                    variant     = 'outlined'
                    label       = 'Applikátor hiv. száma'
                    fullWidth
                    sx          ={{'marginBottom': '1rem'}}
                />
                <TextField
                    value       = {data.cell}
                    onChange    = {(e) => (setData({...data, cell: e.target.value}))}
                    type        = 'text'
                    variant     = 'outlined'
                    label       = 'Cella'
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
                <TextField
                    value       = {data.createdTime}
                    onChange    = {(e) => (setData({...data, createdTime: e.target.value}))}
                    type        = 'time'
                    variant     = 'outlined'
                    label       = 'Idő'
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
                <h3>Gépbeállítás Igény</h3>
                
                <h5>{data.productArticleNumber}</h5>
                <p>Késztermék cikkszáma</p>
                <hr/>
                
				<h5>{data.workOrderNumber}</h5>
                <p>Üzemimegbízás száma</p>
                <hr/>
				
				<h5>{data.terminalArticleNumber}</h5>
                <p>Terminál cikkszáma</p>
                <hr/>
				
				<h5>{data.wireArticleNumber}</h5>
                <p>Vezeték/Kábel cikkszáma</p>
                <hr/>
				
				<h5>{data.wireCrossSectionMM}</h5>
                <p>Vezeték keresztmettszett [mm]</p>
                <hr/>
				
				<h5>{data.wireCrossSectionAWG}</h5>
                <p>Vezeték keresztmettszett [awg]</p>
                <hr/>

                <h5>APL {data.toolNumber}</h5>
                <p>Applikátor</p>
                <hr/>
				
				<h5>{data.cell}</h5>
                <p>Cella</p>
                <hr/>
				
				<h5>{data.createdDate}</h5>
                <p>Kiállítás dátuma</p>
                <hr/>
				
				<h5>{data.createdTime}</h5>
                <p>Idő</p>
                <hr/>
				
				<h5>{data.createdBy}</h5>
                <p>Kiállította</p>				
            </span>
        </Container>
    )
}
