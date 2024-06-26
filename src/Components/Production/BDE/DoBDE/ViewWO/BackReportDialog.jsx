import React, { useState, useContext } from 'react';
import { SelectsContext } from '../../../../../Global/SelectsContext';
import useWindowDimensions from '../../../../../Hooks/useWindowDimensions';
import { Button, Dialog, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
  
const BackReportDialog = ({ openDialog, handleClose, handleSave, userId, bdeNum, goodQ, badQ, reworkQ, errorR, reworkR, pauseR, breakdownR }) => {
    const [open, setOpen]                       = useState(openDialog);
    const [userID, setUserID]                   = useState(userId);
    const [goodQnty, setGoodQnty]               = useState(goodQ);
    const [badQnty, setBadQnty]                 = useState(badQ);
    const [reworkQnty, setReworkQnty]           = useState(reworkQ);
    const [errorReason, setErrorReason]         = useState(errorR);
    const [reworkReason, setReworkReason]       = useState(reworkR);
    const [pauseReason, setPauseReason]         = useState(pauseR);
    const [breakdownReason, setBreakdownReason] = useState(breakdownR);
    const [selects, setSelects]                 = useContext(SelectsContext);
    const screen = useWindowDimensions();

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent sx={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: screen.width > 600 ? 'row' : 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            label="Jó menny."
                            type="number"
                            value={goodQnty}
                            onChange={(e) => setGoodQnty(e.target.value)}
                            sx={{ width: screen.width > 600 ? '25%' : '100%', marginRight: '25px', marginBottom: '20px' }}
                        />
                        <TextField
                            label="Selejt menny."
                            type="number"
                            value={badQnty}
                            onChange={(e) => setBadQnty(e.target.value)}
                            sx={{ width: screen.width > 600 ? '25%' : '100%', marginRight: '25px', marginBottom: '20px' }}
                        />
                        <TextField
                            label="Utómunka menny."
                            type="number"
                            value={reworkQnty}
                            onChange={(e) => setReworkQnty(e.target.value)}
                            sx={{ width: screen.width > 600 ? '25%' : '100%', marginRight: screen.width > 600 ? '0' : '25px', marginBottom: '20px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <FormControl sx={{ minWidth: 120, width: screen.width > 600 ? '84%' : '100%' , marginBottom: '20px' }}>
                            <InputLabel>Selejt oka</InputLabel>
                            <Select value={errorReason} onChange={(e) => setErrorReason(e.target.value)} 
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        },
                                    },
                                }}>
                                <MenuItem value={""} sx={{ height: '2em' }}></MenuItem>
                                {selects
                                    .filter(select => select.selectNumber === '10010')
                                    .map(select =>
                                        select.selectList.length > 0 &&
                                        select.selectList.map((item, index) => (
                                        <MenuItem key={select.selectNumber + '_' + index} value={item}>
                                            {item}
                                        </MenuItem>
                                        ))
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120, width: screen.width > 600 ? '84%' : '100%' , marginBottom: '20px' }}>
                            <InputLabel>Utómunka oka</InputLabel>
                            <Select 
                                value={reworkReason} 
                                onChange={(e) => setReworkReason(e.target.value)}
                                disabled={reworkQnty > 0 ? false : true}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        },
                                    },
                                }}>
                                <MenuItem value={""} sx={{ height: '2em' }}></MenuItem>
                                {selects
                                    .filter(select => select.selectNumber === '10011')
                                    .map(select =>
                                        select.selectList.length > 0 &&
                                        select.selectList.map((item, index) => (
                                        <MenuItem key={select.selectNumber + '_' + index} value={item}>
                                            {item}
                                        </MenuItem>
                                        ))
                                    )
                                }
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button 
                        onClick={() => handleSave({ userID, bdeNum, goodQnty, badQnty, reworkQnty, errorReason, reworkReason, pauseReason, breakdownReason })} 
                        sx={{ color: '#4caf50', fontSize: '16px' }}>Mentés</Button>
                    <Button onClick={handleClose} sx={{ color: '#ef5350', fontSize: '16px' }}>Bezárás</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BackReportDialog;
