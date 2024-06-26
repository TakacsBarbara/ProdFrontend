import React, { createContext } from 'react';
import useLocalStorage from '../Hooks/useLocalStorage';

export const SelectsContext = createContext();

export const SelectsProvider = ({children}) => {
    const [selects, setSelects] = useLocalStorage(
        'selects',
        [
            {
                selectNumber:   '',
                selectList:     [],
            }
        ]
    )

    return (
        <SelectsContext.Provider value={[selects, setSelects]}>
            {children}
        </SelectsContext.Provider>
    )
}