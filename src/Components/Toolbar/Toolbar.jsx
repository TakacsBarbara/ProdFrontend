
import React from 'react'
import ApplicationMenu from './ApplicationMenu';
import UserMenu from './UserMenu';

export default function Toolbar() {

    return(
        <div
            style={{
                width:              '100%',
                height:             '50px',
                display:            'flex',
                justifyContent:     'space-between',
                alignItems:         'center',
                backgroundColor:    '#c0392b',
                color:              '#ecf0f1'
            }}
        >
            <ApplicationMenu/>
            <UserMenu/>
        </div>
    )
}