import React, {useState} from 'react'


import { Paper, Container, Typography, TextField, Button, FormControlLabel, Checkbox} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';


export default function MultiLevelProduct() {
    const originalData = {
        productArticleNumber1:      '',
        productArticleNumber2:      '',
        productArticleNumber3:      '',
        isInBox1:                   '',
        isInBox2:                   '',
        isInBox3:                   '',
        workOrderNumber:            '',
        quantity:                   '',
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
                    Lépcsős Késztermék jelölő
                </Typography>
                <Container sx={{'display': 'flex', 'alignItems': 'flex-start', 'justifyContent':'space-around'}}>
                    <TextField
                        value       = {data.productArticleNumber1}
                        onChange    = {(e) => (setData({...data, productArticleNumber1: e.target.value}))}
                        type        = 'number'
                        variant     = 'outlined'
                        label       = 'Késztermék cikkszáma első szint'
                        sx          = {{'marginBottom': '1rem', 'minWidth': '70%'}}
                    />
                    <FormControlLabel
                        control =   {
                                        <Checkbox
                                            onChange    = {(e) => (setData({...data, isInBox1: e.target.checked}))}
                                            value       = {data.isInBox1}
                                        />
                                    }
                        label       = 'Dobozban'
                    />
                </Container>
                <Container sx={{'display': 'flex', 'alignItems': 'flex-start', 'justifyContent':'space-around'}}>
                    <TextField
                        value       = {data.productArticleNumber2}
                        onChange    = {(e) => (setData({...data, productArticleNumber2: e.target.value}))}
                        type        = 'number'
                        variant     = 'outlined'
                        label       = 'Késztermék cikkszáma második szint'
                        sx          = {{'marginBottom': '1rem', 'minWidth': '70%'}}
                    />
                    <FormControlLabel
                        control =   {
                            <Checkbox
                                onChange    = {(e) => (setData({...data, isInBox2: e.target.checked}))}
                                value       = {data.isInBox2}
                            />
                        }
            label       = 'Dobozban'
                    />
                </Container>
                <Container sx={{'display': 'flex', 'alignItems': 'flex-start', 'justifyContent':'space-around'}}>
                    <TextField
                        value       = {data.productArticleNumber3}
                        onChange    = {(e) => (setData({...data, productArticleNumber3: e.target.value}))}
                        type        = 'number'
                        variant     = 'outlined'
                        label       = 'Késztermék cikkszáma harmadik szint'
                        sx          = {{'marginBottom': '1rem', 'minWidth': '70%'}}
                    />
                    <FormControlLabel
                        control =   {
                            <Checkbox
                                onChange    = {(e) => (setData({...data, isInBox3: e.target.checked}))}
                                value       = {data.isInBox3}
                            />
                        }
            label       = 'Dobozban'
                    />
                </Container>
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
                    onClick={(e) => {window.location = 'printerplus://send?text=' + document.getElementById('data').innerHTML; console.log(data)}}
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
                <h3>Lépcsős Késztermék jelölő</h3>
                
                <h5>{data.productArticleNumber1} {data.isInBox1 ? ' - Dobozban' : ''}</h5>
                <p>Késztermék cikkszáma első szint</p>
                <hr/>

                <h5>{data.productArticleNumber2} {data.isInBox2 ? ' - Dobozban' : ''}</h5>
                <p>Késztermék cikkszáma második szint</p>
                <hr/>

                <h5>{data.productArticleNumber3} {data.isInBox3 ? ' - Dobozban' : ''}</h5>
                <p>Késztermék cikkszáma harmadik szint</p>
                <hr/>

                <h5>{data.workOrderNumber}</h5>
                <p>Üzemimegbízás száma</p>
                <hr/>

                <h5>{data.quantity}</h5>
                <p>Mennyiség</p>
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
