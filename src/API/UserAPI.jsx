let baseURL = process.env.REACT_APP_BASE_URL;

export async function onUserRequestedByID(userID) {
    const response = await fetch(
        `${baseURL}/api/v2/login/byID/${userID}`,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        }
    )
    .catch(error => {throw error})
    
    return response.json()
}

// export function onUserRequested(hash) {
//     return Axios.post(`${baseURL}/abas/login/${hash}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onUserLoginAction(id, action){
//     return Axios.post(`${baseURL}/abas/login/${id}/${action}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onUserAvatarRequested(hash){
//     return Axios.get(`${baseURL}/abas/login/avatar/${hash}`, {responseType: 'blob'})
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onUserBDEDataRequested(id){
//     return Axios.get(`${baseURL}/abas/aps/bde/${id}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }

// export function onUserRequestedByID(id){
//     return Axios.get(`${baseURL}/abas/login/byID/${id}`)
//         .then(response => response.data)
//         .catch(error => {throw error})
// }