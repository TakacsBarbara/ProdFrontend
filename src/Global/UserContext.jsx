import React, { createContext } from 'react';
import useLocalStorage from '../Hooks/useLocalStorage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage(
        'user',
        {
            name:           '',
            id:             null,
            position:       '',
            avatarLink:     '',
            machineGroup:   1100,
            appList:        [
                {
                    id: 0,
                    title: 'Kezdőlap',
                    icon: 'home',
                    path: '/home'
        
                },
                // {
                //     id: 1,
                //     title: 'Címke nyomtatás',
                //     icon: 'dashboard',
                //     path: '/ticket-print'
                // },
                {
                    id: 1,
                    title: 'Gyártó BDE',
                    icon: 'factory',
                    path: '/do-bde'
        
                },
                {
                    id: 2,
                    title: '\'NagyTepsi\' Sarzs',
                    icon: 'factory',
                    path: '/assembly'
        
                },
                {
                    id: 3,
                    title: 'Raktárkönyvelés',
                    icon: 'move_down',
                    path: '/material-booking'
        
                },
                {
                    id: 4,
                    title: 'Tervlap',
                    icon: 'timeline',
                    path: '/material-plan'
        
                },
                {
                    id: 5,
                    title: 'Készlet Infó',
                    icon: 'inventory',
                    path: '/stock-info'
        
                },
                {
                    id: 6,
                    title: 'Gyártás központ',
                    icon: 'list_alt',
                    path: '/cutting-info'
        
                },
                // {
                //     id: 8,
                //     title: 'Sarzs fa',
                //     icon: 'factory',
                //     path: '/sarzs'
        
                // },
            ]
        }
    )

    return(
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}