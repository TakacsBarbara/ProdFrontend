import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../../../Global/UserContext';
import { WorkOrdersContext } from '../../../../../Global/WorkOrdersContext';
import * as UserAPI from '../../../../../API/UserAPI';
import * as ProductionAPI from '../../../../../API/ProductionAPI';

import { Button, ButtonGroup, Container, Paper, TextField, Typography, Snackbar, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BackReportDialog from './BackReportDialog';
import InfoDialog from './InfoDialog';

export default function BDE({ WOIndex, screenW }) {

    const userToAdd                                         = useRef(null);
    const [user, setUser]                                   = useContext(UserContext);
    const [workOrders, setWorkOrders]                       = useContext(WorkOrdersContext);
    const [logsLoading, setLogsLoading]                     = useState(false);
    const [saveInProgress, setSaveInProgress]               = useState(false);
    const [isSaveSuccessful, setIsSaveSuccessful]           = useState(true);
    const [isDialogOpen, setIsDialogOpen]                   = useState(false);
    const [runningTimes, setRunningTimes]                   = useState({});
    const [openSaveMessage, setOpenSaveMessage]             = useState(false);
    const [intervalIds, setIntervalIds]                     = useState({});
    const [showUserHasAddedAlert, setShowUserHasAddedAlert] = useState(false);
    const [userHasOpenedWO, setUserHasOpenedWO]             = useState(false);
    const [isGroup, setIsGroup]                             = useState(false);
    const [singleUserID, setSingleUserID]                   = useState('');
    const [dialogDatas, setDialogDatas]                     = useState({
                                                                goodQnty:           0, 
                                                                badQnty:            0, 
                                                                reworkQnty:         0, 
                                                            });

    const handleAddUser = async e => {

        try {
            let isUserAdded = false;
            const response = await ProductionAPI.onUserRequestedBDE(userToAdd.current.value);
    
            workOrders.map(WO => {
                WO.userList.map(user => {
                    if (user.userID === response.userId) {
                        isUserAdded = true;
                    }
                });
            });
    
            if (response.openedWOCount > 0) {
                isUserAdded = true;
                setUserHasOpenedWO(true);
            }
    
            setWorkOrders(prevWorkOrders => {
                const newWorkOrders = prevWorkOrders.map(WO => {
                    if (!isUserAdded && WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {
                        const newUserList = [...WO.userList, {
                            userID: response.userId,
                            username: response.username,
                            workOrderNumber: WO.workOrderNumber,
                            machineGroup: 1100,
                            isWorking: false,
                            action: 'stop',
                            startDate: '',
                            startTime: '00:00:00',
                            quantities: {
                                goodQnty:           0, 
                                badQnty:            0, 
                                reworkQnty:         0, 
                                errorReason:        '', 
                                reworkReason:       '', 
                                pauseReason:        '', 
                                breakdownReason:    '',
                            },
                            status: 1
                        }];
                        return { ...WO, userList: newUserList };
                    } else if (isUserAdded) {
                        setShowUserHasAddedAlert(true);
                    }
                    return WO;
                });
                return newWorkOrders;
            });
        } catch(error) {
            console.log("Error in handleAddUser: ", error);
        }
    }

    const handleUserModification = async (id) => {
        setIsGroup(false);
        setSingleUserID(id);

        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {
                const newUserList = WO.userList.map( user => {
                    if (user.userID === id) {
                        return {...user, isWorking: !user.isWorking, action: !user.isWorking ? 'start' : 'stop', status: user.status + 1}
                    }
                    return user;
                });

                newUserList.map((user) => {
                    if (user.userID === id && user.isWorking) {
                        const currentDate = new Date();

                        const currentHour = currentDate.getHours();
                        const currentMinute = currentDate.getMinutes();

                        const newIntervalId = setInterval(() => {
                            setRunningTimes((prevRunningTimes) => ({
                                ...prevRunningTimes,
                                [id]: handleTimeDiff(`${currentHour}:${currentMinute}`),
                            }));
                        }, 1000);
                    
                        setIntervalIds((prevIntervalIds) => ({
                            ...prevIntervalIds,
                            [id]: newIntervalId,
                        }));
                    }

                    if (user.userID === id && !user.isWorking) {
                        handleStopInterval(id);
                        user.quantities.goodQnty = 0;
                        user.quantities.badQnty = 0;
                        user.quantities.reworkQnty = 0;
                    }
                });

                return {...WO, userList: newUserList};
            }
            return WO;
        });
        setWorkOrders(newWorkOrders);
    }

    const handleUserRemove = (id) => {
        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {
                const newUserList = WO.userList.filter(user => (user.userID !== id)).map(filteredUser => {
                    return filteredUser;
                });

                return {...WO, userList: newUserList};
            }
            return WO;
        });
        setWorkOrders(newWorkOrders);
    }

    const handleAllUserStart = () => {
        setIsGroup(true);
        setSingleUserID('');

        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {
                const newUserList = WO.userList.map(user => {
                    return {...user, isWorking: true, action: 'start', status: user.status + 1};
                });

                newUserList.map(user => {
                    const currentDate = new Date();

                    const currentHour = currentDate.getHours();
                    const currentMinute = currentDate.getMinutes();

                    const newIntervalId = setInterval(() => {
                        setRunningTimes((prevRunningTimes) => ({
                            ...prevRunningTimes,
                            [user.userID]: handleTimeDiff(`${currentHour}:${currentMinute}`),
                        }));
                    }, 1000);
                
                    setIntervalIds((prevIntervalIds) => ({
                        ...prevIntervalIds,
                        [user.userID]: newIntervalId,
                    }));
                });

                return {...WO, userList: newUserList};
            }
            return WO;
        });

        setWorkOrders(newWorkOrders);
    }

    const handleAllUserStop = () => {
        setIsGroup(true);
        setSingleUserID('');

        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {
                const newUserList = WO.userList.map(user => {
                    return {...user, isWorking: false, action: 'stop'}
                });

                newUserList.map(user => {
                    handleStopInterval(user.userID);
                });

                return {...WO, userList: newUserList};
            }
            return WO;
        });

        setWorkOrders(newWorkOrders);
    }

    const handleTimeDiff = (time) => {
        const timeFromDB = time;

        const [hours, minutes] = timeFromDB.split(":");
        const timeDB = new Date();
        timeDB.setHours(hours);
        timeDB.setMinutes(minutes);
        timeDB.setSeconds(0);

        const now = new Date();
        const diff = now.getTime() - timeDB.getTime();

        const diffSeconds = Math.floor(diff / 1000) % 60;
        const diffMinutes = Math.floor(diff / 1000 / 60) % 60;
        const diffHours = Math.floor(diff / 1000 / 60 / 60);

        const diffTimeString = `${diffHours.toString().padStart(2, "0")}:${diffMinutes.toString().padStart(2, "0")}:${diffSeconds.toString().padStart(2, "0")}`;

        return diffTimeString;
    }

    const handleUserProd = async (id) => {
        setLogsLoading(true);

        setTimeout(async () => {
            const userRes = await UserAPI.onUserRequestedByID(id);

            if (userRes) {
                let logs = userRes.logs;
    
                while (!logs || logs.length === 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    logs = userRes.logs;
                }
                    
                const bdeQntyRes = await ProductionAPI.onQuantityRequested(id, logs[0].ybde);
                if (bdeQntyRes) {
                    handleStopInterval(id);
                    setLogsLoading(false);
                    setDialogDatas({
                        userId:             id, 
                        bdeNum:             logs[0].ybde, 
                        goodQnty:           bdeQntyRes.goodQnty, 
                        badQnty:            bdeQntyRes.badQnty, 
                        reworkQnty:         bdeQntyRes.reworkQnty, 
                        errorReason:        bdeQntyRes.errorReason, 
                        reworkReason:       bdeQntyRes.reworkReason, 
                        pauseReason:        bdeQntyRes.pauseReason, 
                        breakdownReason:    bdeQntyRes.breakdownReason
                    });

                    workOrders[WOIndex].userList.map(worker => {
                        if (worker.userID === id) {
                            worker.quantities.goodQnty    = bdeQntyRes.goodQnty;
                            worker.quantities.badQnty     = bdeQntyRes.badQnty;
                            worker.quantities.reworkQnty  = bdeQntyRes.reworkQnty;
                        }
                    });
                }
    
                setIsDialogOpen(true);
                
                const newIntervalId = setInterval(() => {
                    setRunningTimes((prevRunningTimes) => ({
                        ...prevRunningTimes,
                        [id]: handleTimeDiff(userRes.logs[0].ytbeido),
                    }));
                }, 1000);
            
                setIntervalIds((prevIntervalIds) => ({
                    ...prevIntervalIds,
                    [id]: newIntervalId,
                }));
            }
        }, 4500);
    }

    const handleStopInterval = (userId) => {
        workOrders[WOIndex].userList.map((user) => {
            if (user.userID === userId) {
                setRunningTimes((prevRunningTimes) => ({
                    ...prevRunningTimes,
                    [user.userID]: null,
                }));
            }
        });

        clearInterval(intervalIds[userId]);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDialogSave = async ({ userID, bdeNum, goodQnty, badQnty, reworkQnty, errorReason, reworkReason, pauseReason, breakdownReason }) => {
        let goodQuantityDiff = 0;
        let badQuantityDiff = 0;
        let reworkQuantityDiff = 0;

        setSaveInProgress(true);

        try {
            ProductionAPI.onQuantityChange(bdeNum, goodQnty, badQnty, reworkQnty, errorReason, reworkReason, pauseReason, breakdownReason);
        } catch (err) {
            console.log(err);
            setIsSaveSuccessful(false);
        }

        workOrders[WOIndex].userList.map(worker => {
            if (worker.userID === userID) {
                goodQuantityDiff    = goodQnty - worker.quantities.goodQnty;
                badQuantityDiff     = badQnty - worker.quantities.badQnty;
                reworkQuantityDiff  = reworkQnty - worker.quantities.reworkQnty;

                worker.quantities.goodQnty          = goodQnty;
                worker.quantities.badQnty           = badQnty;
                worker.quantities.reworkQnty        = reworkQnty;
                worker.quantities.errorReason       = errorReason;
                worker.quantities.reworkReason      = reworkReason;
                worker.quantities.pauseReason       = pauseReason;
                worker.quantities.breakdownReason   = breakdownReason;
            }
        });

        const newWorkOrders = workOrders.map(WO => {
            if (WO.workOrderNumber === workOrders[WOIndex].workOrderNumber) {

                const newGoodTotalQnty      = WO.quantities.goodQntyTotal + goodQuantityDiff;
                const newBadTotalQnty       = WO.quantities.badQntyTotal + badQuantityDiff;
                const newReworkTotalQnty    = WO.quantities.reworkQntyTotal + reworkQuantityDiff;

                return {...WO, quantities: {
                    goodQntyTotal:      newGoodTotalQnty,
                    badQntyTotal:       newBadTotalQnty,
                    reworkQntyTotal:    newReworkTotalQnty
                }}
            }
            return WO;
        });

        setWorkOrders(newWorkOrders);
        setSaveInProgress(false);
        setIsDialogOpen(false);
        setOpenSaveMessage(true);
    };

    const handleSaveSuccessMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSaveMessage(false);
    };

    useEffect(() => {
        ProductionAPI.onWorkOrdersChange(workOrders[WOIndex], isGroup, singleUserID);
    }, [workOrders, WOIndex]);

    useEffect(() => {
        setTimeout(() => {
            setShowUserHasAddedAlert(false);
        }, 5000)
    }, [showUserHasAddedAlert]);

    const desktopStyle = {
        container: {
            display: 'flex', 
            alignItems: 'center', 
            justifyContent:'space-between', 
            flexWrap: 'wrap', 
            flexDirection: 'row'
        },
        addPersonButton: {
            width: '400px', 
            marginLeft: '1rem'
        }
    }

    const mobileStyle = {
        container: {
            display: 'flex', 
            alignItems: 'center', 
            justifyContent:'center', 
            flexWrap: 'wrap', 
            flexDirection: 'row'
        },
        addPersonButton: {
            width: '400px', 
            marginTop: '1rem'
        }
    };
    
    return (
        <Container sx={{ padding: screenW < 680 && '0 !important'}}>
            <InfoDialog open={logsLoading} text="Betöltés folyamatban ..."/>
            <InfoDialog open={saveInProgress} text="Mentés ..."/>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSaveMessage} 
                autoHideDuration={4000} 
                onClose={handleSaveSuccessMessageClose} 
                sx={{width: screenW < 1001 ? '40%' : '20%', alignItems: 'center'}}
            >
                <Alert 
                    severity={isSaveSuccessful ? "success" : "error"} 
                    onClose={handleSaveSuccessMessageClose}
                    sx={{ 
                        width: '100%',
                        alignItems: 'center',
                        fontSize: screenW < 1300 ? '1em' : '1.2em',
                        color: isSaveSuccessful ? '#4caf50' : '#ef5350',
                        padding: screenW < 1001 ? '5px 10px' : '5px 20px 5px 30px',
                        border: isSaveSuccessful ? '1px solid #4caf50' : '1px solid #ef5350', 
                        height: '80px'
                    }} 
                >
                    {isSaveSuccessful ? "Mentés sikeres!" : "Mentés sikertelen!"}
                </Alert>
            </Snackbar>
            {showUserHasAddedAlert && 
            <Snackbar
                className     = 'bde-warning-add-user-again'
                anchorOrigin  = {{ vertical: 'top', horizontal: 'right' }}
                open          = {showUserHasAddedAlert} 
                autoHideDuration={4000} 
                onClose={handleSaveSuccessMessageClose} 
            >
                <Alert 
                    severity="warning" 
                    sx={{ justifyContent: 'center', alignItems: 'center', border: '1px solid #ff9800', height: '100px' }}
                >
                    A felhasználót már hozzáadták egy Üzemi megbízáshoz!
                </Alert>
            </Snackbar>
            }
            <Container sx={{ padding: screenW < 680 && '0 !important' }}>
                <Container className='bde-add-new-user' sx={{ display: 'flex' }}>
                    <TextField
                        className       = 'add-person-input'
                        size            = 'large'
                        type            = 'number'
                        variant         = 'outlined'
                        label           = 'Munkatárs hozzáadása'
                        autoComplete    = 'off'
                        inputRef        = {userToAdd}
                        onKeyDown       = { e => (e.key === 'Enter' ? handleAddUser() : null)}
                        sx = {{width: '450px'}}
                    />
                    <Button
                        className   = 'add-person-button'
                        variant     = 'contained'
                        size        = 'large'
                        endIcon     = {screenW > 679 && <PersonAddIcon />}
                        onClick     = {handleAddUser}
                        >
                        { screenW > 679 ? 'Hozzáad' : <PersonAddIcon />}
                    </Button>
                </Container>
                <Container sx = {{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <Button
                        variant     = 'contained'
                        color       = 'warning'
                        sx          = {{width: '20vw'}}
                        onClick     = {handleAllUserStop}
                        >
                        { screenW > 700 && <span>STOP All</span> }
                        <StopIcon/>

                    </Button>
                    <Button
                        variant     = 'contained'
                        color       = 'success'
                        sx          = {{width: '20vw', marginLeft: '1em'}}
                        onClick     = {handleAllUserStart}
                        >
                        { screenW > 700 && <span>START All</span> }
                        <PlayArrowIcon/>
                    </Button>
                </Container>
            </Container>
            <Container>
                {(isDialogOpen && dialogDatas !== null) && 
                (<BackReportDialog 
                    userId          =   {dialogDatas.userId}
                    openDialog      =   {isDialogOpen} 
                    handleClose     =   {handleDialogClose} 
                    handleSave      =   {handleDialogSave} 
                    bdeNum          =   {dialogDatas.bdeNum}
                    goodQ           =   {dialogDatas.goodQnty}
                    badQ            =   {dialogDatas.badQnty}
                    reworkQ         =   {dialogDatas.reworkQnty}
                    errorR          =   {dialogDatas.errorReason}
                    reworkR         =   {dialogDatas.reworkReason}
                    pauseR          =   {dialogDatas.pauseReason}
                    breakdownR      =   {dialogDatas.breakdownReason}
                />)}
                {workOrders[WOIndex].userList.map(worker => (
                    <Paper
                        key = {worker.userID}
                        sx={{
                            display: 'flex',
                            justifyContent: screenW < 765 ? 'center' : 'space-between',
                            alignItems: 'center',
                            marginTop: '1rem',
                            padding: '1rem 1rem 0.5rem 1rem',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={{ width: screenW < 1200 ? '100%' : '50%', textAlign: 'left' }}>
                            <Typography  variant='h6' sx={{ width: screenW < 765 ? '100%' : '70%', display: 'inline-block', textAlign: screenW < 765 ? 'center' : 'left' }} >{worker.username}</Typography>
                            <Typography key={runningTimes[worker.userID]} variant="h6" sx={{ width: screenW < 765 ? '100%' : '30%', display: 'inline-block', textAlign: 'center' }} >{runningTimes[worker.userID] ? runningTimes[worker.userID] : worker.startTime }</Typography>
                        </div>
                        <ButtonGroup sx={{ marginTop: screenW < 1200 ? '1em' : '0' }}>
                            <Button
                                id          = {worker.userID}
                                key         = {worker.userID}
                                variant     = 'contained'
                                color       = {worker.isWorking ? 'warning' : 'success'}
                                endIcon     = {screenW >= 1000 && <MoreTimeIcon/>}
                                onClick     = {() => { handleUserModification(worker.userID) }}
                                sx          = {{width: screenW > 650 ? '10vw' : '20vw', lineHeight: '100%'}}
                            >
                                {screenW >= 1000 ? <span>{worker.isWorking ? 'Stop' : 'Start'}</span> : <span>{worker.isWorking ? <StopIcon/> : <PlayArrowIcon/>}</span>}
                            </Button>
                            { worker.isWorking ? (
                                    <Button
                                        id          = {worker.userID}
                                        variant     = 'contained'
                                        color       = 'success'
                                        endIcon     = {<AddShoppingCartIcon/>}
                                        onClick     = {() => { handleUserProd(worker.userID) }}
                                        sx          = {{width: screenW > 650 ? '10vw' : '20vw'}}
                                        disabled
                                    ></Button>
                                ) : (
                                    <Button
                                        variant     = 'contained'
                                        color       = 'error'
                                        endIcon     = {<PersonRemoveIcon/>}
                                        onClick     = {() => { handleUserRemove(worker.userID) }}
                                        sx          = {{width: screenW > 650 ? '10vw' : '20vw'}}
                                    ></Button>
                                )
                            }
                            
                        </ButtonGroup>
                    </Paper>
                ))}
            </Container>
        </Container>
    )
}