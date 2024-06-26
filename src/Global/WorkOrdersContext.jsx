import React, { createContext } from 'react'
import useLocalStorage from '../Hooks/useLocalStorage'

export const WorkOrdersContext = createContext()

export const WorkOrdersProvider = ({children}) => {
    const [workOrders, setWorkOrders] = useLocalStorage(
        'workOrder',
        [
            {
                workOrderNumber:        '',
                article:                '',
                articleDescription:     '',
                quantityTotal:          '',
                quantityProduced:       '',
                startDate:              '',
                endDate:                '',
                userList:               [],
                BOM: [{
                        workOrderNumber:    0,
                        article:            0,
                        articleDescription: 0,
                        quantity:           0,
                        unit:               0 
                }],
                quantities: {
                    goodQntyTotal: 0, 
                    badQntyTotal: 0, 
                    reworkQntyTotal: 0
                },
                status:                 1
            }
        ]
    )

    return(
        <WorkOrdersContext.Provider value={[workOrders, setWorkOrders]}>
            {children}
        </WorkOrdersContext.Provider>
    )
}