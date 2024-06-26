import React, { useState, useRef, useEffect } from 'react';
import { Container, Paper, Button, Typography, Grid, TextField } from "@mui/material";
import useWindowDimensions from './../../../Hooks/useWindowDimensions';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import jsQR from 'jsqr';
import * as ProductionAPI from './../../../API/ProductionAPI';
import InfoAlert from './../../Warehouse/InfoAlert';

export default function Sarzs() {
    const {width}                                   = useWindowDimensions();
    const screenW                                   = width;
    const videoRef                                  = useRef(null);
    const canvasRef                                 = useRef(null);
    const actRawMatNum                              = useRef('');
    const finishedProdNum                           = useRef('');
    const [cameraActive, setCameraActive]           = useState(false);
    const [rawMaterialArray, setRawMaterialArray]   = useState([]);
    const [showInfoAlert, setShowInfoAlert]         = useState(false);
    const [saveIsSuccess, setSaveIsSuccess]         = useState(false);
    const [alertMessage, setAlertMessage]           = useState('');

    const deleteItem = (index) => () => {
        setRawMaterialArray((rawMaterialArray) => rawMaterialArray.filter((_, i) => i !== index));
    }

    const checkFinishedProdNum = (num) => {
        if (num.charAt(0) === '3') {
            return true;
        } else {
            return false;
        }
    }

    const checkRawMatNum = (num) => {
        if (num.charAt(0) === '2') {
            return true;
        } else {
            return false;
        }
    }

    const handleFinishedProdNum = (num) => {
        if (checkFinishedProdNum(num)) {
            finishedProdNum.current.value = num;
        } else {
            setSaveIsSuccess(false);
            setAlertMessage("Ebbe a mezőbe csak Késztermék Sarzsot olvashat be! (például: 3-xxxxxx)");
            setShowInfoAlert(true);
        }
    }

    const handleRawMatNum = (num) => {
        if (checkRawMatNum(num)) {
            setRawMaterialArray([num, ...rawMaterialArray]);
            actRawMatNum.current.value = num;

            setTimeout(() => {
                actRawMatNum.current.value = '';
            }, 1000);

        } else {
            setSaveIsSuccess(false);
            setAlertMessage("Ebbe a mezőbe csak Alapanyag Sarzsot olvashat be! (például: 2-xxxxxx)");
            setShowInfoAlert(true);
        }
    }

    const handleInputValidation = (inputValue, isValidStart) => {
        if (!inputValue.startsWith(isValidStart)) {
            return false;
        } else {
            return true;
        }
    };

    const handleSave = () => {
        if (finishedProdNum.current.value !== '' && rawMaterialArray.length > 0) {

            const data = {
                kesztermek: finishedProdNum.current.value,
                alapanyag: rawMaterialArray,
            };

            ProductionAPI.onSarzsTreeSent(data).then(
                response => {
                    if (response.status === 200) {
                        setSaveIsSuccess(true);
                        setAlertMessage("Mentés sikeres!");
                        setShowInfoAlert(true);
                        finishedProdNum.current.value = '';
                        setRawMaterialArray([]);
                    } else {
                        setSaveIsSuccess(false);
                        setAlertMessage("Mentés sikertelen!");
                        setShowInfoAlert(true);
                    }
                }
            );

        } else {
            setSaveIsSuccess(false);
            setAlertMessage("Kérem adja meg a Késztermék és Alapanyag Sarzsot!");
            setShowInfoAlert(true);
        }
    }

    const handleDelete = () => {
        finishedProdNum.current.value = '';
        setRawMaterialArray([]);
    }

    const startQRCodeReader = async (id) => {
        setCameraActive(true);
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            const videoTrack = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);
            const scanFrame = () => {
                if (videoTrack.readyState === 'live') {
                    imageCapture.grabFrame()
                        .then((imageBitmap) => {
                        canvasRef.current.width = imageBitmap.width;
                        canvasRef.current.height = imageBitmap.height;
                        const canvasContext = canvasRef.current.getContext('2d');
                        canvasContext.drawImage(imageBitmap, 0, 0);
                        const imageData = canvasContext.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code) {
                            stream.getTracks().forEach((track) => track.stop());
                            if (id === 'finished-product-qr-scanner') {
                                handleFinishedProdNum(code.data);
                                setCameraActive(false);
                            } else if (id === 'raw-material-qr-scanner') {
                                handleRawMatNum(code.data);
                                setCameraActive(false);
                            }
                        }
                        requestAnimationFrame(scanFrame);
                        })
                        .catch((error) => {
                            console.error('Error capturing frame:', error);
                        });
                }

            };
            scanFrame();
          })
          .catch((error) => {
            console.error('Error accessing camera:', error);
          });
    };

    const handleCloseAlert = () => {
        setShowInfoAlert(false);
    };

    return (
        <Paper
            className = 'material-booking-main-container'
            elevation = {3} 
            sx = {{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '2rem', 
                width: '90vw', 
                minHeight: screenW > 1179 ? '500px' : '700px', 
                margin: '2rem auto',
                position: 'relative'
            }}
        >
            {showInfoAlert && <InfoAlert success={saveIsSuccess} onClose={handleCloseAlert} message={alertMessage} />}
            <Container 
                sx={{
                    position: 'absolute',
                    top: '1rem',
                    right: screenW >= 800 ? '1rem' : '0',
                    display: 'flex',
                    justifyContent: screenW >= 800 ? 'flex-end' : 'center',
                }}
            >
                <Button variant="contained" color="success" style={{ margin: 10, backgroundColor:'#3BBD44' }} startIcon={<SaveIcon/>}
                    onClick={ handleSave }
                >
                    Mentés
                </Button>
                <Button variant="contained" style={{ margin: 10, backgroundColor:'#BD3B3B' }} startIcon={<DeleteIcon/>}
                    onClick={ handleDelete }
                >
                    Törlés
                </Button>
            </Container>
            <Container
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginTop: screenW >= 800 ? '80px' : '150px',
                }}
            >
                <Typography variant="h4" sx={{ position: 'absolute', top: screenW >= 800 ? '1.5rem' : '6rem', marginBottom: '40px'}}>Sarzs fa</Typography>

                <Typography variant="h6" sx={{ marginBottom: '10px' }}>Késztermék Sarzs</Typography>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 && '100%' }}>
                    <TextField
                        inputRef = {finishedProdNum}
                        sx = {{ width: '300px' }}
                        onInput={(e) => {
                            const inputValue = e.target.value;

                            if (inputValue.length >= 2) {
                                
                                if (handleInputValidation(e.target.value, '3-')) {
                                  finishedProdNum.current.value = e.target.value;
                                } else {
                                    setSaveIsSuccess(false);
                                    setAlertMessage("Ebbe a mezőbe csak Késztermék Sarzsot olvashat be! (például: 3-xxxxxx)");
                                    setShowInfoAlert(true);
                                    finishedProdNum.current.value = '';
                                }
                            }
                        }}
                        onBlur={(e) => {
                            finishedProdNum.current.value = e.target.value;
                        }}
                    />
                    <div style={{ margin: '0 0 10px 10px', height: '100%', display: 'flex', alignItems: 'center' }}>
                        <QrCodeScannerIcon
                            id      = 'finished-product-qr-scanner'
                            onClick = { (e) => startQRCodeReader(e.target.id) }
                            sx      = {{ fontSize: '50px', cursor: 'pointer', marginTop: '10px' }}
                        />
                    </div>
                </div>

                <Typography variant="h6" sx={{ margin: '30px auto 10px' }}>Alapanyag Sarzs</Typography>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 && '100%' }}>
                    <TextField
                        inputRef = { actRawMatNum }
                        sx={{ width: '300px' }}
                        onInput={(e) => {
                            const inputValue = e.target.value;

                            if (inputValue.length >= 2) {
                                
                                if (handleInputValidation(e.target.value, '2-')) {
                                    actRawMatNum.current.value = e.target.value;
                                } else {
                                    setSaveIsSuccess(false);
                                    setAlertMessage("Ebbe a mezőbe csak Késztermék Sarzsot olvashat be! (például: 2-xxxxxx)");
                                    setShowInfoAlert(true);
                                    actRawMatNum.current.value = '';
                                }
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value !== '') {
                                actRawMatNum.current.value = e.target.value;
                                setRawMaterialArray([e.target.value, ...rawMaterialArray]);

                                setTimeout(() => {
                                    actRawMatNum.current.value = '';
                                }, 1000);
                            }
                        }}
                    />
                    <div style={{ margin: '0 0 10px 10px', height: '100%', display: 'flex', alignItems: 'center' }}>
                        <QrCodeScannerIcon
                            id      = 'raw-material-qr-scanner'
                            onClick = { (e) => startQRCodeReader(e.target.id) }
                            sx      = {{ fontSize: '50px', cursor: 'pointer', marginTop: '10px' }}
                        />
                    </div>
                </div>

                <Container style={{ marginTop: 20 }}>
                    {rawMaterialArray && rawMaterialArray.map((e, index) => {
                        return (
                            <Paper elevation={2} key={index} sx={{ width: '100%', display: 'flex', flexDirection: "row", justifyContent: 'space-between', padding: '1rem', marginTop: 2 }}>
                                <Typography variant="h6" color="secodary" sx={{ margin: '1rem' }}>{index + 1}.</Typography>
                                <Typography variant="h6" color="secodary" sx={{ marginTop: '1rem' }}>{e}</Typography>
                                <Button onClick={deleteItem(index)} startIcon={<DeleteIcon/>} style={{ color:'#BD3B3B' }}>Törlés</Button>
                            </Paper>
                        );
                    }
                )}
            </Container>
            </Container>
            {cameraActive && (
                <>
                    <div 
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '50' }}
                        onClick={() => setCameraActive(false)}
                    ></div>
                    <div
                        className='qr-scanner-container'
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '10px',
                            zIndex: '100'
                        }}
                    >
                        <video ref={videoRef} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '10px' }}/>
                        <div style={{ 
                            position: 'absolute', 
                            top: '-15%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            color: 'white', 
                            fontSize: '40px', 
                            fontWeight: 'bold', 
                            width: '100%', 
                            textAlign: 'center' 
                            }}
                        >
                            QR kód beolvasása
                        </div>
                    </div>
                </>
            )}
        </Paper>
    )
}
