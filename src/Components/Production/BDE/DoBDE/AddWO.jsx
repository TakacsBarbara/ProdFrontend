import React, {useContext, useEffect, useRef, useState} from 'react';
import { WorkOrdersContext } from '../../../../Global/WorkOrdersContext';
import * as ProductionAPI from '../../../../API/ProductionAPI';
import {Button, Paper, TextField, Typography} from '@mui/material';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import InfoDialog from './ViewWO/InfoDialog';
import useWindowDimensions from '../../../../Hooks/useWindowDimensions';
import '../../../../App.css';

export default function AddWO({ setTabIndex }) {
    const WO = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogText, setDialogText] = useState("Betöltés folyamatban...");
    const [workOrders, setWorkOrders] = useContext(WorkOrdersContext);

    const screen = useWindowDimensions();

    const handleAddWo = async e => {

        let isOpenedWO = false;
        setOpenDialog(true);
        
        const data = await ProductionAPI.onWorkOrderRequested(WO.current.value);
        // const qntyData = await ProductionAPI.onTotalQuantityRequested(WO.current.value);
        
        if (Object.keys(data).length !== 0) {

            workOrders.map((wOrder) => {
                if (wOrder.workOrderNumber === WO.current.value) {
                    isOpenedWO = true;
                }
            });
    
            if (isOpenedWO) {
                const index = workOrders.findIndex((item) => item["workOrderNumber"] === WO.current.value);
    
                if (index !== -1) {
                const removed = workOrders.splice(index, 1)[0];
                workOrders.push(removed);
                }
    
                if (data) {
                    setTabIndex(workOrders.length-1);
                    setOpenDialog(false);
                }
                
            } else {
                setWorkOrders(current => [...current, {
                    workOrderNumber:        WO.current.value,
                    article:                data.data.article,
                    articleDescription:     data.data.articleDescription,
                    quantityTotal:          data.data.quantity,
                    quantityProduced:       data.data.quantityLeft,
                    startDate:              data.data.startDate,
                    endDate:                data.data.endDate,
                    BOM:                    data.data.BOM,
                    userList:               [],
                    quantities:             {
                        // goodQntyTotal:      qntyData.goodQntyTotal,
                        // badQntyTotal:       qntyData.badQntyTotal,
                        // reworkQntyTotal:    qntyData.reworkQntyTotal
                        goodQntyTotal:      0,
                        badQntyTotal:       0,
                        reworkQntyTotal:    0
                    }
                }]);
    
                if (data) {
                    setTabIndex(workOrders.length);
                    setOpenDialog(false);
                }
            }
        } else {
            setDialogText("Az Üzemi megbízás nem létezik!");
            setTimeout(() => {
                setOpenDialog(false);
                setDialogText("Betöltés folyamatban...");
            }, 3000);
        }
    }

    return(
        <Paper elevation={3} sx = {{margin: '2rem auto', width: screen.width > 580 ? '80vw' : '100%', minHeight: screen.width > 580 ? '700px' : '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <InfoDialog open={openDialog} text={dialogText}/>
            <Typography
                className='add-wo-title'
                variant = 'h2'
                sx = {{margin: '2rem auto', textAlign: 'center', marginBottom: '60px'}}
            >
                Új Munkalap hozzáadása
            </Typography>
            <TextField
                className       = 'add-wo-component'
                inputRef        = {WO}
                autoComplete    = 'off'
                type            = 'number'
                label           = 'Munkalap száma'
                variant         = 'outlined'
                size            = 'large'
                onKeyDown       = { e => (e.key === 'Enter' ? handleAddWo() : null)}
            />
            <Button
                className       = 'add-wo-component'
                variant         = 'contained'
                color           = 'primary'
                size            = 'large'
                endIcon         = {<ShortcutIcon/>}
                onClick         = {handleAddWo}
                sx = {{marginTop: '20px'}}
            >
                Hozzáadás
            </Button>
        </Paper>
    )
}