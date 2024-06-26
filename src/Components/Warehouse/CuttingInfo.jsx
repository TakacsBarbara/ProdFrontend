import {useNavigate} from 'react-router';
import React, { useRef, useState, useEffect } from 'react';
import { Container, Paper, TextField, InputLabel, IconButton, Table, Typography, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import InfoDialog from '../Production/BDE/DoBDE/ViewWO/InfoDialog';
import * as ArticleAPI from '../../API/ArticelAPI';
import '../../TableCuttingInfo.css';

export default function CuttingInfo() {
    const factoryMandate  = useRef('');
    const article         = useRef('');
    const customer        = useRef('');
    const locker          = useRef('');
    const consumption     = useRef('');
    const startDateFrom   = useRef('');
    const startDateTo     = useRef('');
    const endDateFrom     = useRef('');
    const endDateTo       = useRef('');
    const [data, setData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const {width} = useWindowDimensions();
    const navigate = useNavigate();

    const styleMobile = {
        '& .MuiInputBase-input[type="date"]': {
            width: '200px',
            textAlign: 'right',
        },
        mainContainer: {
            minWidth: '100%', 
            display: 'flex', 
            flexWrap: 'wrap', 
            flexDirection: 'row', 
            justifyContent: 'space-between'
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', 
            textAlign: 'center',
            marginTop: '30px'
        }, 
        dateInput: {
            width: '200px',
        },
        dash: {
            display: 'none'
        },
        searchButton: {
            minWidth: '100%',
            textAlign: 'center',
            padding: '30px 0 20px 0'
        }
    }
    
    const styleDesktop = {
        '& .MuiInputBase-input[type="date"]': {
            width: '200px',
            textAlign: 'center'
        },
        mainContainer: {
            minWidth: '100%', 
            display: 'flex', 
            flexWrap: 'wrap', 
            flexDirection: 'row', 
            justifyContent: 'space-between'
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'baseline',
            width: '50%',
            textAlign: 'center',
            marginTop: '30px'
        }, 
        dateInput: {
            width: '200px',
        },
        dash: {
            margin: '20px'
        },
        searchButton: {
            minWidth: '100%',
            textAlign: 'right',
            padding: '30px 60px 0 0'
        }
    }

    const handleSubmit = async e => {
        
        if (factoryMandate.current.value || article.current.value || customer.current.value || locker.current.value || consumption.current.value || startDateFrom.current.value || startDateTo.current.value || endDateFrom.current.value || endDateTo.current.value) {
            setData(null);
            setOpenDialog(true);

            const response = await ArticleAPI.onCuttingInfoRequested(factoryMandate.current.value, article.current.value, customer.current.value, locker.current.value, consumption.current.value, startDateFrom.current.value, startDateTo.current.value, endDateFrom.current.value, endDateTo.current.value);
            
            if (Object.keys(response).length === 0) {
                setNoResultsFound(true);
                setData({description: response.description, table:[]});
            } else {
                setNoResultsFound(false);
                setData(response); 
            }
        }
    }

    const checkStartDateFrom = () => {
        const startDateToInput = document.querySelector('#startDateTo');

        if (startDateFrom.current.value) {
            startDateToInput.min = startDateFrom.current.value;

            if (!startDateTo.current.value) {
                startDateTo.current.value = startDateFrom.current.value;
            }
        }

        if (startDateTo.current.value && (startDateTo.current.value < startDateFrom.current.value)) {
            startDateTo.current.value = startDateFrom.current.value;
        }
    }

    const checkEndDateFrom = () => {
        const endDateToInput = document.querySelector('#endDateTo');

        if (endDateFrom.current.value) {
            endDateToInput.min = endDateFrom.current.value;

            if (!endDateTo.current.value) {
                endDateTo.current.value = endDateFrom.current.value;
            }
        }

        if (endDateTo.current.value && (endDateTo.current.value < endDateFrom.current.value)) {
            endDateTo.current.value = endDateFrom.current.value;
        }
    }

    useEffect(() => {
        if (openDialog && data) {
          setOpenDialog(false);
        }
        
        if (openDialog && noResultsFound) {
            setOpenDialog(false);
        }
    }, [data, openDialog]); 
    
    const handleRowClick = (megbizas) => {
        console.log(data);
        
        if (megbizas) {
            navigate(`/prod-center/${megbizas}`); 
        }
    }

    return (
        <Container sx={{minWidth: '100vw', minHeight: '95vh', padding: '2rem'}}>
             <InfoDialog open={openDialog} text="Keresés folyamatban ..."/>
             <Container sx={{minWidth: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TextField
                    autoComplete    = 'off'
                    label           = 'Üzemi megbízás'
                    type            = 'number'
                    inputRef        = {factoryMandate}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    className       = 'searchInputField'
                />
                <TextField
                    autoComplete    = 'off'
                    label           = 'Árucikk'
                    type            = 'string'
                    inputRef        = {article}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    className       = 'searchInputField'
                />
                <TextField
                    autoComplete    = 'off'
                    label           = 'Részleg'
                    type            = 'string'
                    inputRef        = {locker}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    className       = 'searchInputField'
                />
                <TextField
                    autoComplete    = 'off'
                    label           = 'Felhasználás'
                    type            = 'string'
                    inputRef        = {consumption}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    className       = 'searchInputField'
                />
            </Container>
            <Container sx={styleDesktop.mainContainer}>
                <Container className='dateInputContainer' sx={width > 1200 ? styleDesktop.container : styleMobile.container }>
                    <InputLabel id='start-date-label' htmlFor='startDateFrom' sx={{ marginRight: '20px' }}>Kezdési időpont</InputLabel>
                    <TextField
                        id              = 'startDateFrom'
                        autoComplete    = 'off'
                        label           = 'Tól'
                        type            = 'date'
                        inputRef        = {startDateFrom}
                        onChange        = {checkStartDateFrom}
                        onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                        className       = 'dateInputField'
                    />
                    <Typography sx={width > 1200 ? styleDesktop.dash : styleMobile.dash }
                        variant="span"
                    >-</Typography>
                    <TextField
                        id              = 'startDateTo'
                        autoComplete    = 'off'
                        label           = '-ig'
                        type            = 'date'
                        inputRef        = {startDateTo}
                        onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                        className       = 'dateInputField'
                    />
                </Container>
                <Container sx={width > 1200 ? styleDesktop.container : styleMobile.container }>
                    <InputLabel id='end-date-label' htmlFor='endDateFrom' sx={{ marginRight: '20px' }}>Befejezési idő</InputLabel>
                    <TextField
                        id              = 'endDateFrom'
                        autoComplete    = 'off'
                        label           = 'Tól'
                        type            = 'date'
                        inputRef        = {endDateFrom}
                        onChange        = {checkEndDateFrom}
                        onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                        className       = 'dateInputField'
                    />
                    <Typography sx={width > 1200 ? styleDesktop.dash : styleMobile.dash }
                        variant="span"
                    >-</Typography>
                    <TextField
                        id              = 'endDateTo'
                        autoComplete    = 'off'
                        label           = '-ig'
                        type            = 'date'
                        inputRef        = {endDateTo}
                        onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                        className       = 'dateInputField'
                    />
                </Container>
            </Container>
            <Container sx={width > 1200 ? styleDesktop.searchButton : styleMobile.searchButton}>
                <IconButton onClick={handleSubmit} sx={{ fontSize: '20px', borderRadius: '5px', color: 'rgb(192, 57, 43)' }}>
                    <PlayCircleFilledIcon sx={{marginRight: '5px'}}/> <span>Keresés</span>
                </IconButton>
            </Container>
            <TableContainer className='cutting-table' component={Paper} sx={{ overflowY: 'auto', width: '100%', margin: '20px auto', maxHeight: '800px' }}>
                {data === null && !noResultsFound ? (<Typography variant='h6' textAlign='center' sx={{ margin: '20px auto' }} >Adjon meg legalább egy keresési feltételt!</Typography>) : (
                    noResultsFound ? (
                        <Typography variant = 'h6' textAlign='center' sx= {{ margin: '1rem auto' }}>Nincs a keresésnek megfelelő eredmény!</Typography>
                    ) : (
                        <Table stickyHeader >
                            <TableHead>
                                <TableRow sx={{ textAlign: 'center', alignItems: 'center' }}>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>#</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Üzemi megbízás</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Státusz Üzemi megbízásból</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Státusz kiír</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Bázis árucikk</TableCell>
                                    <TableCell sx={{ textAlign: 'center', width: '80px' }} variant='head'>Árucikk</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Info a továbbadáshoz</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Részleg</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Nettó összmennyiség</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Átadandó/Nyitott mennyiség</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Rendelkezésre állás</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Egység</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Kezdő határidő</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Befejező határidő</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Legkorábbi befej. határidő</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Cél határidő</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Fixált folyamat</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }} variant='head'>Fix határidő</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow
                                        key={`row_${index}`}
                                        onClick={ () => handleRowClick(row.uzemi_megbizas)}
                                        sx={{ 
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { cursor: 'pointer' }
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{index+1}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.uzemi_megbizas}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.uzemi_megbizas_statusz}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.statusz_kiir}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.bazis_arucikk}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.arucikk}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.info_a_tovabbadashoz}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.reszleg}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.osszmennyiseg}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.atadando_mennyiseg}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.rendelkezesre_allo_komponensek_raktaron}/{row.rendelkezesre_allo_komponensek_beszerzesen_keresztul}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.egyseg}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.kezdo_hatarido && `${row.kezdo_hatarido}.`}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.befejezesi_hatarido && `${row.befejezesi_hatarido}.`}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.legkorabbi_befejezesi_hatarido && `${row.legkorabbi_befejezesi_hatarido}.`}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.cel_hatarido && `${row.cel_hatarido}.`}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.folyamat_fixalasa}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{row.hatarido_fixalva}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )
                )} 
            </TableContainer>
        </Container> 
    )
}