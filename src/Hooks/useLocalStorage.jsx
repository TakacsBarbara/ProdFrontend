import React from 'react'

export default function useLocalStorage(storageKey, fallbackState){
    const [value, setValue] = React.useState(
        JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
    )

    React.useEffect(()=> {
        localStorage.setItem(storageKey, JSON.stringify(value))
    }, [value, setValue])

    return [value, setValue]
}