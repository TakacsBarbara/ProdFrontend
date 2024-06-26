import React, { useCallback, useState, useEffect } from "react";
import { Container, Paper, Button, Typography, Grid, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import * as ProductionAPI from '../../../API/ProductionAPI';

export default function Assembly(){
   
    var [scanResult, setScanResult] =  useState('');
    var [isElso, setIsElso] = useState(true);
    var [focikk, setFocikk] =  useState('');
    var [alcikk, setAlcikk] =  useState('');
    var [array, setArray] = useState([]);
    

    const handleOnKeyDown = useCallback((e) => {  //ez figyeli a leütött gombokat

        if (e.key === 'Enter') {

            if (isElso) {
                setFocikk(scanResult);
                setIsElso(false);
            } else {
                setAlcikk(scanResult);
            }

            if (array.includes(scanResult)) {
                console.log("van");
            } else setArray([...array,scanResult]);

            setScanResult('');
        } else {
            e.key === 'ö' ? setScanResult(scanResult + '0') : setScanResult(scanResult + e.key) ||
            e.key === 'ü' ? setScanResult(scanResult + '-') : setScanResult(scanResult + e.key) || 
            e.key === 'Shift' ? setScanResult(scanResult + '') : setScanResult(scanResult + e.key)

            console.log("else the scanResult: " + scanResult);

            if (scanResult == "Unidentified") {
                setScanResult('');
                setTimeout(() => {
                    console.log('Rossz adat törölve!');
                }, 1000);
            }
        }
    }, [scanResult, setScanResult]);

  useEffect(() => {
        document.addEventListener("keydown", handleOnKeyDown, false);

        return () => {
            document.removeEventListener("keydown", handleOnKeyDown, false);
        };
    }, [handleOnKeyDown]);

    const deleteItem = (index) => () => {
        setArray((array) => array.filter((_, i) => i !== index));
        document.getElementById("valami").focus();
    }

    return (
        <>
        {/* <div id="valami"></div> */}
        <TextField id="valami" style={{width: 0}} ></TextField> 
        <Grid container direction="column" alignItems="center">
            <Typography variant="h4" style={{ marginTop: 20 }}>
                Lemez Sarzsszáma:
            </Typography>
            <Typography variant="h3" style={{ marginTop: 20 }}>
                {focikk}
            </Typography>
            <Typography variant="h4" style={{ marginTop: 20 }}>
                Beépülő Sarzsok:
            </Typography>
            <Container style={{ marginTop: 20 }}>
                {array && array.map((e, index) => {
                    return (
                        index === 0 ? (
                            <></>
                        ) : (
                            <>
                                <Paper key={index} elevation={2} sx={{ width: '100%', display: 'flex', flexDirection: "row", justifyContent: 'space-between', padding: '1rem', marginTop: 2 }}>
                                    <Typography variant="h6" color="secodary" sx={{ margin: '1rem' }}>{index}.</Typography>
                                    <Typography variant="h6" color="secodary">{e}</Typography>
                                    <Button onClick={deleteItem(index)} startIcon={<DeleteIcon/>} style={{ color:'#BD3B3B' }}>Törlés</Button>
                                </Paper>
                            </>
                        )
                    );
                }
                )}
            </Container>
            <Container sx={{ display: 'center', justifyContent: 'center' }}>
                <Button variant="contained" color="success" style={{ margin: 20, backgroundColor:'#3BBD44' }} disabled={!focikk} startIcon={<SaveIcon/>}
                onClick={(e) => {
                    ProductionAPI.onAssemblySarzsSent(array).then(
                        response => {
                            console.log(JSON.stringify(array)); //ez küldi a JSON-t
                            setIsElso(true);
                            setFocikk('');
                            setArray([]);
                            console.log('onClick');
                        }
                    )
                    
                } }
                >
                    Mentés
                </Button>
                <Button variant="contained" style={{ margin: 20, backgroundColor:'#BD3B3B' }} disabled={!focikk} startIcon={<DeleteIcon/>}
                onClick={(e) => {
                    setIsElso(true);
                    setFocikk('');
                    setArray([]);
                } }
                >
                    Minden törlés
                </Button>
            </Container>

        </Grid></>
    )


}