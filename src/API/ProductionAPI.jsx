let baseURL = process.env.REACT_APP_BASE_URL;

export async function onWorkOrderRequested(workOrder) {
    const response = await fetch(
        `${baseURL}/api/v2/work-order-data/${workOrder}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onWorkOrdersChange(workOrder, isGroup, singleUserID) {
    const response = await fetch(
        `${baseURL}/api/v2/work-order/time-update`,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userList: workOrder.userList, isGroup: isGroup, userID: singleUserID})
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onUserRequestedBDE(userID) {
    const response = await fetch(
        `${baseURL}/api/v2/work-order/user-data`,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: userID})
        }
    )
    .catch(error => {throw error});
    
    return response.json();
}

export async function onQuantityRequested(userID, bdeNum) {
    const response = await fetch(
        `${baseURL}/abas/bde/backreport/${userID}/${bdeNum}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onQuantityChange(bdeNum, goodQnty, badQnty, reworkQnty, errorReason, reworkReason, pauseReason, breakdownReason) {
    const response = await fetch(
        `${baseURL}/abas/bde/backreport`,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({bdeNum, goodQnty, badQnty, reworkQnty, errorReason, reworkReason, pauseReason, breakdownReason})
        }
    )
    .catch(error => {throw error});

    return response;
}

export async function onSelectItemsRequested(selectId) {

    const response = await fetch(
        `${baseURL}/abas/bde/select/${selectId}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onTotalQuantityRequested(workOrderNumber) {

    const response = await fetch(
        `${baseURL}/abas/bde/total-quantity/${workOrderNumber}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onAssemblySarzsSent(sarzsList) {
    const response = await fetch(
        `${baseURL}/api/v2/iot-scanner/product-scanner`,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({data: sarzsList})
        }
    )
    .catch(error => {throw error});

    return response;
}

export async function onSarzsTreeSent(sarzsList) {
    const response = await fetch(
        `${baseURL}/iot_scanner/sarzs-list`,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({data: sarzsList})
        }
    )
    .catch(error => {throw error});

    return response;
}

// export function onProductionListRequested() {
//     return Axios.get(`${baseURL}/abas/aps/production-list`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onWorkOrderRequested(workOrder) {
//     return Axios.get(`${baseURL}/abas/aps/work-order-data/${workOrder}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onBDErequested(action, user, workOrderNumber, machineGroup){
//     return Axios.get(`${baseURL}/abas/aps/bde/${user}/${workOrderNumber}/${machineGroup}/${action}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }


// export function onUserListUpdated(userList){
//     return Axios.post(`${baseURL}/abas/bde/update`, {userList})
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onWorkOrderReport(workOrderNumber){
//     return Axios.get(`${baseURL}/abas/worksheet/${workOrderNumber}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onWorksheetReportUpdate(workOrderNumber, reportDetail){
//     return Axios.post(`${baseURL}/abas/worksheet/${workOrderNumber}`, {table: reportDetail})
//         .then(response => response.data)
//         .catch(error => {throw error})
// }