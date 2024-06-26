import React, {useContext} from 'react';
import { Grid } from '@mui/material';
import { UserContext } from '../../Global/UserContext';
import DashboardCard from './DashboardCard';

export default function Dashboard() {
    const [user, setUser] = useContext(UserContext);

    return (
        user ? (
            <Grid className='card-container' container sx={{ justifyContent: 'center', alignItems: 'center', padding: '20px', width: '80%', margin: '0 auto' }}>
                {user.appList.map(application => (
                    <Grid item key={application.id}>
                        <DashboardCard application={application} />
                    </Grid>
                ))}
            </Grid>
        ) : (
            <h1>Betöltés...</h1>
        )

    )
}