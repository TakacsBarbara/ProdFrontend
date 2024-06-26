import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Typography, Paper, Divider } from '@mui/material';
import { useNavigate, useParams  } from 'react-router-dom';
import { WorkOrdersContext } from '../../../../../Global/WorkOrdersContext';
import useWindowDimensions from '../../../../../Hooks/useWindowDimensions';
import * as ProductionAPI from '../../../../../API/ProductionAPI';
import InfoDialog from './InfoDialog';
import '../../../../../TableCuttingInfo.css';

const ProdCenter = () => {
    const [loading, setLoading] = useState(false);
    const screen = useWindowDimensions();
    const screenW = screen.width;
    const { id } = useParams();
    const navigate = useNavigate();
    const [WO, setWO] = useState({
        workOrderNumber:        '',
        article:                '',
        articleDescription:     '',
        quantityTotal:          '',
        quantityProduced:       '',
        startDate:              '',
        endDate:                '',
        BOM:                    [],
        userList:               []
    });
    const [workOrders, setWorkOrders] = useContext(WorkOrdersContext);

    const desktopStyle = {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '1rem 2rem',
        minWidht: '100%',
        margin: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }

    const mobileStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 2rem 2rem 2rem',
        minWidht: '100%',
        margin: 'auto',
        flexDirection: 'column',
        flexWrap: 'wrap'
    }

    
    useEffect(() => {

        async function fetchData() {
            const data = await ProductionAPI.onWorkOrderRequested(id);

            setWO({
                workOrderNumber:        id,
                article:                data.data.article,
                articleDescription:     data.data.articleDescription,
                quantityTotal:          data.data.quantity,
                quantityProduced:       data.data.quantityLeft,
                startDate:              data.data.startDate,
                endDate:                data.data.endDate,
                BOM:                    data.data.BOM,
                userList:               []
            });
        }

        fetchData();
       
    }, [id]);

    useEffect(() => {
        console.log(WO);
    }, [WO]);

    const handleonClick = (WONum) => {
        let isOpenedWO = false;
        setLoading(true);

        async function fetchData() {
            const data = await ProductionAPI.onWorkOrderRequested(WONum);
            // const qntyData = await ProductionAPI.onTotalQuantityRequested(WONum);

            console.log(data);
            // console.log(qntyData);

            workOrders.map((WO) => {
                if (WO.workOrderNumber === WONum) {
                    isOpenedWO = true;
                }
            });

            if (isOpenedWO) {
                const index = workOrders.findIndex((item) => item["workOrderNumber"] === WONum);

                if (index !== -1) {
                const removed = workOrders.splice(index, 1)[0];
                workOrders.push(removed);
                }

            } else {
                setWorkOrders(current => [...current, {
                    workOrderNumber:        WONum,
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
            }

            if (data) {
                navigate(`/do-bde`);
            }
        }

        fetchData();
        
    }

  return (
    <>
        {WO.BOM.length ? (
            <Container component={Paper} sx = {{ width: '80%', padding: '20px', margin: '20px auto' }}>
                {loading && ( <InfoDialog open={true} text="Átirányítás ..." /> )}
                <Typography variant='h4' color='secondary'>{WO.workOrderNumber}</Typography>
                <Typography variant='h6'>
                    {WO.article} - {WO.articleDescription}
                </Typography>
                <Container
                    sx={ screenW < 700 ? mobileStyle : desktopStyle }
                >
                    <Typography variant='subtitle2'>Teljes Mennyiség:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3}} >{WO.quantityTotal}</Typography>{' '}</Typography>   
                    <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Gyártandó Mennyiség:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3}} >{WO.quantityProduced}</Typography>{' '}</Typography>
                    <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Kezdési Dátum:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3}} >{WO.startDate}</Typography>{' '}</Typography>   
                    <Typography variant='subtitle2' sx={{ marginLeft: 2 }}>Befejezési Dátum:{' '}<Typography variant='h6' component='span' sx={{ marginLeft: 3}} >{WO.endDate}</Typography>{' '}</Typography>   
                </Container>
            <Divider sx={{ margin: '10px auto 20px' }} />
            <Container sx={{ minWidth: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center' }}>
                {WO.BOM.filter(row => (row.workOrderNumber !== '')).map((element, index, arr) => {
                        if (arr.length === 1) {
                            return <Button className='operationButton' key={element.workOrderNumber} variant='contained' size='large' onClick={() => handleonClick(element.workOrderNumber)} sx={{ my: 1 }}>{element.articleDescription}</Button>;
                        } else if (index > 0) {
                            return <Button className='operationButton' key={element.workOrderNumber} variant='contained' size='large' onClick={() => handleonClick(element.workOrderNumber)} sx={{ my: 1 }}>{element.articleDescription}</Button>;
                        } else {
                            return null;
                        }
                    }
                )}
                </Container>
            </Container>
        ) : ( <InfoDialog open={true} text="Betöltés folyamatban ..." /> )}
    </>
  );
}

export default ProdCenter;
