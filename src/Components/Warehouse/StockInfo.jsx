import React, { useRef, useState } from 'react';
import { Container, TextField, IconButton, FormControlLabel, Checkbox, Table, Typography, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import * as ArticleAPI from '../../API/ArticelAPI';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';

export default function StockInfo() {
    const article                           = useRef('');
    const locker                            = useRef('');
    const lockerPlace                       = useRef('');
    const [isCollection, setisCollection]   = useState(false);
    const [isZero, setisZero]               = useState(false);
    const [isNegative, setisNegative]       = useState(false);
    const [isPackDev, setisPackDev]         = useState(false);
    const [data, setData]                   = useState(null);

    const handleSubmit = async e => {
        const response = await ArticleAPI.onStockInfoRequested(article.current.value, locker.current.value, lockerPlace.current.value, isCollection, isPackDev, isZero, isNegative);
        if (response.table === null) { 
            setData({description: response.description, table:[]});
        } else { 
            setData(response);
        }
    }

    return (
        <Container sx={{minWidth: '100vw', minHeight: '95vh', padding: '2rem'}}>
            <Container className='inner-desc-container' sx={{minWidth: '100%', display: 'flex', justifyContent: 'space-around'}}>
                <TextField
                    autoComplete    = 'off'
                    label           = 'Árucikk'
                    type            = 'string'
                    inputRef        = {article}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    InputProps      = {{
                        endAdornment: (
                            <IconButton onClick={handleSubmit}>
                                <SearchIcon/>
                            </IconButton>
                        )
                    }}
                />
                <TextField
                    disabled
                    label           = 'Belső megnevezés'
                    value           = {data === null || (Array.isArray(data) && data.length === 0) ? '' : data.description}
                    className       = 'inner-description'
                />
            </Container>
            <Container sx = {{minWidth: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '20px', flexWrap: 'wrap'}}>
                <TextField
                    autoComplete    = 'off'
                    label           = 'Raktár'
                    type            = 'string'
                    className       = 'search-input'
                    inputRef        = {locker}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    InputProps      = {{
                        endAdornment: (
                            <IconButton onClick={handleSubmit}>
                                <SearchIcon/>
                            </IconButton>
                        )
                    }}
                />
                <TextField
                    autoComplete    = 'off'
                    label           = 'Raktárhely'
                    type            = 'string'
                    className       = 'search-input'
                    inputRef        = {lockerPlace}
                    onKeyDown       = { e => (e.key === 'Enter' ? handleSubmit() : null)}
                    InputProps      = {{
                        endAdornment: (
                            <IconButton onClick={handleSubmit}>
                                <SearchIcon/>
                            </IconButton>
                        )
                    }}
                />
            </Container>
            <Container sx = {{minWidth: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '2rem', flexWrap: 'wrap', flexDirection: 'row'}}>
                <FormControlLabel control={<Checkbox />} onChange={() => {setisZero(!isZero)}} label="Nulla készletekkel"/>
                <FormControlLabel control={<Checkbox />} onChange={() => {setisCollection(!isCollection)}} label="Gyűjtés"/>
                <FormControlLabel control={<Checkbox />} onChange={() => {setisPackDev(!isPackDev)}} label="Csak csomagolóeszköz"/>
                <FormControlLabel control={<Checkbox />} onChange={() => {setisNegative(!isNegative)}} label="Csak negatív készletek"/>
            </Container>
            {data === null || (Array.isArray(data) && data.length === 0) ? (<Typography variant='h3' textAlign='center' sx={{marginTop: '5rem'}}>Előbb válasszon egy árucikket!</Typography>) : (
                data.table.length > 0 ? (
                    <TableContainer sx={{ overflow: 'auto', maxHeight: '800px', marginTop: '30px' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant='head'>Raktár</TableCell>
                                    <TableCell variant='head'>Rhely</TableCell>
                                    <TableCell variant='head'>Diszpó</TableCell>
                                    <TableCell variant='head'>Összkészlet</TableCell>
                                    <TableCell variant='head'>Raktáregység</TableCell>
                                    <TableCell variant='head'>Sarzs</TableCell>
                                    <TableCell variant='head'>Felhasználás</TableCell>
                                    <TableCell variant='head'>Kiszerelés készlet</TableCell>
                                    <TableCell variant='head'>Kiszerelés egység</TableCell>
                                    <TableCell variant='head'>Bevét</TableCell>
                                    <TableCell variant='head'>Kivét</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.table.map((row, index) => (
                                    <TableRow
                                        key={`${row.raktar}_${index}`}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.raktar}
                                        </TableCell>
                                        <TableCell>{row.rhely}</TableCell>
                                        <TableCell>
                                            {row.diszpo ? (
                                                <IconButton>
                                                    <CheckBoxSharpIcon sx={{color:'#4cd137'}}/>
                                                </IconButton>
                                            ) : (
                                                <IconButton>
                                                    <CheckBoxOutlineBlankSharpIcon/>
                                                </IconButton>
                                            )}
                                        </TableCell>
                                        <TableCell>{row.osszkeszlet}</TableCell>
                                        <TableCell>{row.raktaregyseg}</TableCell>
                                        <TableCell>{row.sarzs}</TableCell>
                                        <TableCell>{row.felhasznalas}</TableCell>
                                        <TableCell>{row.kiszereleskeszlet}</TableCell>
                                        <TableCell>{row.kiszerelesegyseg}</TableCell>
                                        <TableCell>{row.bevet}</TableCell>
                                        <TableCell>{row.kivet}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant='h3' textAlign='center' sx={{marginTop: '5rem'}}>Az árucikknek nincsenek készeltei!</Typography>
                )
            )}
        </Container>
    )
}