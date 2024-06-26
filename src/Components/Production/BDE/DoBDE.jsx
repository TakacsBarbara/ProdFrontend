import React, {useContext, useState} from 'react';
import { Container, Tabs, Tab} from '@mui/material';
import { WorkOrdersContext } from '../../../Global/WorkOrdersContext';
import AddWO from './DoBDE/AddWO';
import ViewWo from './DoBDE/ViewWO';

export default function DoBDE() {
    const [workOrders, setWorkOrders]   = useContext(WorkOrdersContext);
    const [tabIndex, setTabIndex]       = useState(workOrders.length > 0 ? workOrders.length - 1 : 0);

    const handleWOStop = async () => {
        await stopAllUser();
        setTabIndex(0);
        const newWorkOrders = workOrders.filter(WO => (WO.workOrderNumber !== workOrders[tabIndex].workOrderNumber)).map(filteredWO => {
            return filteredWO;
        });
        setWorkOrders(newWorkOrders);
    }

    const stopAllUser = () => {
        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[tabIndex].workOrderNumber) {
                const newUserList = WO.userList.map(user => {
                    return {...user, isWorking: false, action: 'stop'}
                })
                return {...WO, userList: newUserList}
            }
            return WO;
        })
        setWorkOrders(newWorkOrders);
    }

    return(
        <Container sx = {{ minWidth: '100%'}}>
            <Tabs variant="fullWidth" value={tabIndex} onChange={(event, newTabIndex) => (setTabIndex(newTabIndex))}>
                { workOrders.map(workOrder => (
                    <Tab key={workOrder.workOrderNumber} label={workOrder.workOrderNumber === '' ? 'Új +' : workOrder.workOrderNumber} />
                ))}
            </Tabs>
            {tabIndex === 0 ? (
                <AddWO setTabIndex={setTabIndex} />
            ) : (
                <ViewWo WOIndex={tabIndex} handleWOStop={handleWOStop}/>
            )}            
        </Container>
    )
}