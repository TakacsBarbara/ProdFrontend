import React, { useRef, useState } from 'react';
import { Container } from '@mui/system';

import * as ArticleAPI from '../../API/ArticelAPI'
import { IconButton, InputAdornment, Table, TextField, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';

export default function MaterialPlan(){
    const [data, setData] = useState(null);
    const article = useRef(null);

    const handleSubmit = async e => {
        const response = await ArticleAPI.onMaterialPlanRequested(article.current.value);
        setData(response);
    }

    return (
        <Container sx = {{minWidth: '100vw', minHeight: '95vh', padding: '2rem'}}>
            <Container sx = {{minWidth: '100%', display: 'flex', justifyContent: 'space-around'}}>
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
                    value           = {data === null || Object.keys(data).length === 0 ? '' : data.description}
                    sx              = {{width: '70vw'}}
                />
            </Container>
            { data === null ? (<Typography variant = 'h3' textAlign='center' sx= {{marginTop: '5rem'}}>Előbb válasszon egy árucikket!</Typography>) : 
             Object.keys(data).length !== 0 ? (
                <Table stickyHeader sx={{ marginTop: '50px' }}>
                    <TableHead>
                    <TableRow>
                        <TableCell variant = 'head'>Hét</TableCell>
                        <TableCell variant = 'head'>Tény H.I.</TableCell>
                        <TableCell variant = 'head'>Cél H.I.</TableCell>
                        <TableCell variant = 'head'>Legkorábbi H.I.</TableCell>
                        <TableCell variant = 'head'>Bevét</TableCell>
                        <TableCell variant = 'head'>Kivét</TableCell>
                        <TableCell variant = 'head'>Rendelkezésre áll</TableCell>
                        <TableCell variant = 'head'>Részegység</TableCell>
                        <TableCell variant = 'head'>Részegység megnevezése</TableCell>
                        <TableCell variant = 'head'>Felhasználás</TableCell>
                        <TableCell variant = 'head'>Folyamat</TableCell>
                        <TableCell variant = 'head'>Fix</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.table !== null && (data.table.map(row => (
                                <TableRow key = {row.het + row.tenyHI + row.rendelkezesreAll} sx = {{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        {row.het}
                                    </TableCell>
                                    <TableCell>{row.tenyHI && `${row.tenyHI}.`}</TableCell>
                                    <TableCell>{row.celHI && `${row.celHI}.`}</TableCell>
                                    <TableCell>{row.legkorabbiHI && `${row.legkorabbiHI}.`}</TableCell>
                                    <TableCell>{row.bevet}</TableCell>
                                    <TableCell>{row.kivet}</TableCell>
                                    <TableCell>{row.rendelkezesreAll}</TableCell>
                                    <TableCell>{row.reszegyseg}</TableCell>
                                    <TableCell>{row.reszegysegMegnevezese}</TableCell>
                                    <TableCell>{row.felhasznalas}</TableCell>
                                    <TableCell>{row.folyamat}</TableCell>
                                    <TableCell>
                                        {row.fix ? (
                                            <IconButton>
                                                <CheckBoxSharpIcon sx={{color:'#4cd137'}}/>
                                            </IconButton>
                                        ) : (
                                            <IconButton>
                                                <CheckBoxOutlineBlankSharpIcon/>
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))
                        }
                    </TableBody>
                </Table>
            ) : (
                <Typography variant = 'h3' textAlign='center' sx= {{marginTop: '5rem'}}>A keresett árucikk nem létezik!</Typography>
            )}
        </Container>
    )
}