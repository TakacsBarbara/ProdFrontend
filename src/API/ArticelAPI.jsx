let baseURL = process.env.REACT_APP_BASE_URL;

export async function onArticleCutlistRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/files/cutlist/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onArticleCdwgRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/files/cdwg/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onArticleAdwgRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/files/adwg/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onArticleCellaInfoRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/files/cellainfo/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onArticlePicRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/files/pic/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onStockInfoRequested(article, locker, lockerPlace, isCollection, isPackDev, isZero, isNegative) {

    const queryParams = new URLSearchParams();

    if (article) {
        queryParams.append('article', article);
    }

    if (locker) {
        queryParams.append('locker', locker);
    }

    if (lockerPlace) {
        queryParams.append('lockerPlace', lockerPlace);
    }

    if (isCollection !== undefined && isCollection !== false) {
        queryParams.append('isCollection', isCollection);
    }

    if (isPackDev !== undefined && isPackDev !== false) {
        queryParams.append('isPackDev', isPackDev);
    }

    if (isZero !== undefined && isZero !== false) {
        queryParams.append('isZero', isZero);
    }

    if (isNegative !== undefined && isNegative !== false) {
        queryParams.append('isNegative', isNegative);
    }
    
    const response = await fetch (
        `${baseURL}/api/v2/stock-info?${queryParams.toString()}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {
        console.log(error.stack);
        throw error
    });

    return response.json();
}

export async function onCuttingInfoRequested(factoryMandate, article, customer, locker, consumption, startDateFrom, startDateTo, endDateFrom, endDateTo) {

    const queryParams = new URLSearchParams();

    if (factoryMandate) {
        queryParams.append('factoryMandate', factoryMandate);
    }

    if (article) {
        queryParams.append('article', article);
    }

    if (customer) {
        queryParams.append('customer', customer);
    }

    if (locker) {
        queryParams.append('locker', locker);
    }

    if (consumption) {
        queryParams.append('consumption', consumption);
    }

    if (startDateFrom) {
        queryParams.append('startDateFrom', startDateFrom);
    }

    if (startDateTo) {
        queryParams.append('startDateTo', startDateTo);
    }

    if (endDateFrom) {
        queryParams.append('endDateFrom', endDateFrom);
    }

    if (endDateTo) {
        queryParams.append('endDateTo', endDateTo);
    }
    
    const response = await fetch (
        `${baseURL}/api/v2/prod-center?${queryParams.toString()}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {
        console.log(error.stack);
        throw error
    });

    return response.json();
}

export async function onMaterialPlanRequested(article) {
    const response = await fetch (
        `${baseURL}/api/v2/material-plan/${article}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error});

    return response.json();
}

export async function onArticleQuantityChange(userId, qrCodeDataArticle, qrCodeDataActLockerPlace, qrCodeDataTargetLockerPlace, quantity) {
    try {
        const response = await fetch(
            `${baseURL}/api/v2/material-booking-article`,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userId, qrCodeDataArticle, qrCodeDataActLockerPlace, qrCodeDataTargetLockerPlace, quantity})
            }
        )
        return response;
    } catch(error) {
        console.log(error)
        return {};
    }
}