import React, { useContext, useState, useRef, useEffect } from 'react';
import { Paper, Container, TextField, InputAdornment, Button, Typography, ButtonGroup } from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { UserContext } from '../../Global/UserContext';
import useWindowDimensions from '../../Hooks/useWindowDimensions';
import * as ArticleAPI from './../../API/ArticelAPI';
import InfoAlert from './InfoAlert';
import jsQR from 'jsqr';
import '../../App.css';

export default function MaterialBooking() {
    const {width} = useWindowDimensions();
    const screenW = width;

    const [user]                                                            = useContext(UserContext);
    const [article, setArticle]                                             = useState({});
    const current                                                           = new Date();
    const actualDate                                                        = current.toLocaleDateString('hu-HU');
    const videoRef                                                          = useRef(null);
    const canvasRef                                                         = useRef(null);
    const [qrCodeDataArticle, setQRCodeDataArticle]                         = useState('');
    const [qrCodeDataActLockerPlace, setQRCodeDataActLockerPlace]           = useState('');
    const [qrCodeDataTargetLockerPlace, setQRCodeDataTargetLockerPlace]     = useState('');
    const [cameraActive, setCameraActive]                                   = useState(false);
    const [articleData, setArticleData]                                     = useState(null);
    const [articleLockerUnit, setArticleLockerUnit]                         = useState('');
    const [quantity, setQuantity]                                           = useState(0);
    const [isNotSaveable, setIsNotSaveable]                                 = useState(true);
    const [showInfoAlert, setShowInfoAlert]                                 = useState(false);
    const [saveIsSuccess, setSaveIsSuccess]                                 = useState(false);
    const [alertMessage, setAlertMessage]                                   = useState('');
    const [articleInput, setArticleInput]                                   = useState('');
    const [actLockerInput, setActLockerInput]                               = useState('');
    const [targetLockerInput, setTargetLockerInput]                         = useState('');

    const desktopStyle = {
        subTitle: {
            margin: screenW >= 1180 ? '10px auto 20px' : '20px auto'
        },
        subTitle2: {
            margin: screenW >= 1180 ? '30px auto 20px' : '40px auto 20px'
        },
        inputFields: {
            marginBottom: '10px',
            textAlign: 'center',
            width: screenW >= 1180 ? '250px' : '100%'
        }
    };

    const getArticleNumber = (article) => {
        const parts = article.split('-');
        if (parts.length >= 3) {
            return parts[1].substring(0, 5);
        } else {
            console.log('Invalid input string format');
        }
    }

    const getArticleDatas = async (article) => {
        const articleNum = article;

        if (articleNum.includes("-")) {
            articleNum = getArticleNumber(article);
        }

        const response = await ArticleAPI.onStockInfoRequested(articleNum);
        // console.log(response);

        if (Object.keys(response).length === 0) {
            setArticleData(null);
            setQRCodeDataArticle('');
            setSaveIsSuccess(false);
            setAlertMessage(articleNum + " számmal árucikk nem létezik!");
            setShowInfoAlert(true);
        } else {
            setArticleData(response);
            setQRCodeDataArticle(articleNum);
        }
    };

    const checkLockerPlaceExists = (place) => {
        let isLockerPlaceExist = false;

        if (articleData.table !== null) {

            articleData.table.map( item => {
                if (item.rhely === place) {
                    isLockerPlaceExist = true;
                    setArticleLockerUnit(item.raktaregyseg);
                }
            });
        }

        if (isLockerPlaceExist) {
            setQRCodeDataActLockerPlace(place);
        } else {
            setSaveIsSuccess(false);
            setAlertMessage(place + " raktárhelyen nem áll rendelkezésre a keresett árucikk!");
            setShowInfoAlert(true);
            setQRCodeDataActLockerPlace('');
        }
    };

    const checkTargetLockerPlace = (place) => {

        if (qrCodeDataActLockerPlace !== '') {

            if (place !== qrCodeDataActLockerPlace) {
                setQRCodeDataTargetLockerPlace(place);
            } else {
                setSaveIsSuccess(false);
                setAlertMessage("A Forrás és Cél raktárhely nem lehet azonos!");
                setShowInfoAlert(true);
            }
        } else {
            setSaveIsSuccess(false);
            setAlertMessage("Először olvassa be a Forrás raktárhelyet!");
            setShowInfoAlert(true);
        }
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleCheckQuantity = () => {

        const foundActLocker = articleData.table.find(item => item.rhely === qrCodeDataActLockerPlace);
        let osszkeszlet = (foundActLocker.osszkeszlet).replace('.', '');
        
        if (foundActLocker) {
            if (parseFloat(quantity) <= parseFloat((osszkeszlet).replace(',', '.')) && qrCodeDataActLockerPlace !== qrCodeDataTargetLockerPlace) {
                setIsNotSaveable(false);
            } else {
                setSaveIsSuccess(false);
                setAlertMessage(`${qrCodeDataActLockerPlace} raktárhelyen rendelkezésre álló készlet: ${foundActLocker.osszkeszlet}`);
                setShowInfoAlert(true);
                setIsNotSaveable(true);
            }
        } else {
            setSaveIsSuccess(false);
            setAlertMessage(`${qrCodeDataActLockerPlace} raktárhely nem található!`);
            setShowInfoAlert(true);
        }
    };

    const handleSave = async () => {
        const userId = user.id;

        try {
            const response = await ArticleAPI.onArticleQuantityChange(userId, qrCodeDataArticle, qrCodeDataActLockerPlace, qrCodeDataTargetLockerPlace, quantity);
            
            if (response.status === 200) {
                setSaveIsSuccess(true);
                setAlertMessage("Mentés sikeres!");
                setShowInfoAlert(true);

                setArticleData(null);
                setQRCodeDataActLockerPlace('');
                setQRCodeDataTargetLockerPlace('');
                setArticleInput('');
                setActLockerInput('');
                setTargetLockerInput('');
                setArticleLockerUnit('');
                setQRCodeDataArticle('');
                setQuantity(0);
            }
        } catch(err) {
            console.log(err.message);
            setSaveIsSuccess(false);
            setAlertMessage("Mentés sikertelen!");
            setShowInfoAlert(true);
        }
    };

    const handleCloseAlert = () => {
        setShowInfoAlert(false);
    };

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
                            if (id === 'article-qr-scanner') {
                                getArticleDatas(code.data);
                                setCameraActive(false);
                            } else if (id === 'actual-place-qr-scanner') {
                                checkLockerPlaceExists(code.data);
                                setCameraActive(false);
                            } else if (id === 'target-place-qr-scanner') {
                                checkTargetLockerPlace(code.data);
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

    const handleArticleInputChange = (event) => {
        setArticleInput(event.target.value);
    };

    const handleActLockerInputChange = (event) => {
        setActLockerInput(event.target.value);
    };

    const handleTargetLockerInputChange = (event) => {
        setTargetLockerInput(event.target.value);
    }

    useEffect(() => {
        setCameraActive(false);
        setIsNotSaveable(true);
    }, [qrCodeDataArticle, qrCodeDataActLockerPlace, qrCodeDataTargetLockerPlace, quantity]);

    return (
        <Paper
            className = 'material-booking-main-container'
            elevation = {3} 
            sx = {{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'space-around', 
                padding: '2rem', 
                width: '80vw', 
                minHeight: screenW > 1179 ? '500px' : '700px', 
                margin: '2rem auto'
            }}
        >
            {showInfoAlert && <InfoAlert success={saveIsSuccess} onClose={handleCloseAlert} message={alertMessage} />}
            <Typography variant='h3' sx={{ marginBottom: '20px' }} >Raktárkönyvelés</Typography>
            <Container 
                sx= {{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    flexWrap: 'wrap', 
                    flexDirection: screenW >= 1180 ? 'row' : 'column', 
                    width: '100%' 
                }}
            >
                <Container
                    className = 'material-booking-block-container article-datas-container'
                    sx= {{ 
                        display: 'flex', 
                        alignItems: screenW >= 1180 ? 'flex-start' : 'center', 
                        justifyContent: screenW >= 1180 ? 'space-around' : 'center', 
                        flexWrap: 'wrap', 
                        flexDirection: 'column'
                    }}
                >
                    <Typography
                        className='subtitles'
                        variant='h6'
                        sx={ desktopStyle.subTitle }
                    >
                        Árucikk Adatai
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 && '100%' }}>
                        <TextField
                            label       = 'Cikkszám'
                            value       = { qrCodeDataArticle ? qrCodeDataArticle : articleInput }
                            sx          = { desktopStyle.inputFields }
                            onChange    = { handleArticleInputChange }
                            onBlur      = { () => getArticleDatas(articleInput) }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab') {
                                    getArticleDatas(articleInput);
                                }
                                if (e.key === 'Backspace') {
                                    setArticleInput('');
                                    setQRCodeDataArticle('');
                                    setArticleData(null);
                                }
                            }}
                        />
                        <div style={{ margin: '0 0 10px 10px', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <QrCodeScannerIcon
                                id      = 'article-qr-scanner'
                                onClick = { (e) => startQRCodeReader(e.target.id) }
                                sx      = {{ fontSize: '50px', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                    <TextField
                        className   = 'material-booking-article-description'
                        label       = 'Megnevezés'
                        value       = { articleData !== null ? articleData.description : '' }
                        disabled
                    />
                </Container>
            </Container>
                <Container
                    className = 'material-booking-block-container account-container'
                    sx= {{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-around', 
                        flexWrap: 'wrap', 
                        flexDirection: screenW >= 1180 ? 'row' : 'column', 
                        width: '100%'
                    }}
                >
                    <Typography
                        className='subtitles'
                        variant='h6'
                        sx={ desktopStyle.subTitle2 }
                    >
                        Könyvelés
                    </Typography>
                        
                    <Container 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-around', 
                            flexWrap: 'wrap', 
                            flexDirection: screenW >= 1180 ? 'row' : 'column'
                        }}
                    >
                        <div style={{ width: '100%' }}>
                            <div style={{ width: '100%', display: screenW < 1180 ? 'block' : 'none', marginBottom: '15px' }}>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => checkLockerPlaceExists('TERMELESRH')}
                                        disabled={!qrCodeDataArticle}
                                    >
                                        Termelés_RH
                                    </Button>
                                    <Button
                                        onClick={() => checkLockerPlaceExists('KESZARU_RH')}
                                        disabled={!qrCodeDataArticle}
                                    >
                                        Készáru_RH
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <div style={{ display: screenW < 1180 && 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 ? '100%' : '35%' }}>
                            <ButtonGroup size="small" sx={{ display: screenW < 1180 ? 'none' : 'block', width: '100%', marginBottom: '10px' }}>
                                <Button
                                    onClick={() => checkLockerPlaceExists('TERMELESRH')}
                                    disabled={!qrCodeDataArticle}
                                >
                                    Termelés_RH
                                </Button>
                                <Button
                                    onClick={() => checkLockerPlaceExists('KESZARU_RH')}
                                    disabled={!qrCodeDataArticle}
                                >
                                    Készáru_RH
                                </Button>
                            </ButtonGroup>
                            <TextField
                                label       = 'Forrás Raktárhely'
                                value       = { qrCodeDataActLockerPlace ? qrCodeDataActLockerPlace : actLockerInput }
                                type        = 'text'
                                sx          = {{ width: screenW >= 1180 ? '300px' : '100%' }}
                                onChange    = { handleActLockerInputChange }
                                onBlur      = { () => checkLockerPlaceExists(actLockerInput) }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Tab') {
                                        checkLockerPlaceExists(actLockerInput);
                                    }
                                    if (e.key === 'Backspace') {
                                        setActLockerInput('');
                                        setQRCodeDataActLockerPlace('');
                                    }
                                }}
                            />
                            <div style={{ marginLeft: '10px', marginTop: screenW >= 1180 && '5px', height: '100%', display: screenW >= 1180 ? 'inline-block' : 'flex', alignItems: 'center' }}>
                                <QrCodeScannerIcon
                                    id       = 'actual-place-qr-scanner'
                                    onClick  = { (e) => startQRCodeReader(e.target.id) }
                                    sx ={{
                                        fontSize: '50px',
                                        cursor: 'pointer',
                                        opacity: qrCodeDataArticle === '' ? 0.5 : 1,
                                        pointerEvents: qrCodeDataArticle === '' ? 'none' : 'auto',
                                    }}
                                />
                            </div>
                        </div>
                        <StartIcon 
                            sx={{ 
                                fontSize: '40px',
                                transform: screenW < 1180 && 'rotate(90deg)',
                                margin: screenW < 1180 && '20px auto'
                            }}
                        />

                        <div style={{ width: '100%', display: screenW >= 1180 ? 'none' : 'block', marginBottom: '15px' }}>
                            <ButtonGroup>
                                <Button
                                    onClick={() => checkTargetLockerPlace('TERMELESRH')}
                                    disabled={!qrCodeDataArticle || qrCodeDataActLockerPlace === ''}
                                >
                                    Termelés_RH
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div style={{ display: screenW < 1180 && 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 ? '100%' : '35%' }}>
                            <ButtonGroup size="small" sx={{ display: screenW < 1180 ? 'none' : 'block', width: '100%', marginBottom: '10px' }}>
                                <Button
                                    onClick={() => checkTargetLockerPlace('TERMELESRH')}
                                    disabled={!qrCodeDataArticle || qrCodeDataActLockerPlace === ''}
                                >
                                    Termelés_RH
                                </Button>
                            </ButtonGroup>
                            <TextField
                                label       = 'Cél Raktárhely'
                                value       = { qrCodeDataTargetLockerPlace ? qrCodeDataTargetLockerPlace : targetLockerInput }
                                type        = 'text'
                                sx          = {{ width: screenW >= 1180 ? '300px' : '100%' }}
                                onChange    = { handleTargetLockerInputChange }
                                onBlur      = { () => checkTargetLockerPlace(targetLockerInput) }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Tab') {
                                        checkTargetLockerPlace(targetLockerInput);
                                    }
                                    if (e.key === 'Backspace') {
                                        setTargetLockerInput('');
                                        setQRCodeDataTargetLockerPlace('');
                                    }
                                }}
                            />
                            <div style={{ marginLeft: '10px', marginTop: screenW >= 1180 && '5px', height: '100%', display: screenW >= 1180 ? 'inline-block' : 'flex', alignItems: 'center' }}>
                                <QrCodeScannerIcon
                                    id      = 'target-place-qr-scanner'
                                    onClick = { (e) => startQRCodeReader(e.target.id) }
                                    sx ={{
                                        fontSize: '50px',
                                        cursor: 'pointer',
                                        opacity: !qrCodeDataArticle || qrCodeDataActLockerPlace === '' ? 0.5 : 1,
                                        pointerEvents: !qrCodeDataArticle || qrCodeDataActLockerPlace === '' ? 'none' : 'auto',
                                    }}
                                />
                            </div>
                        </div>
                    </Container>
                </Container>
                <Container 
                    sx= {{ 
                        flexWrap: 'wrap', 
                        flexDirection: screenW >= 1180 ? 'row' : 'column',
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: screenW >= 1180 ? 'space-around' : 'center',
                        margin: screenW < 1180 && '20px auto'
                    }}
                >
                    <Container 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-around', 
                            flexWrap: 'wrap', 
                            flexDirection: screenW >= 1180 ? 'row' : 'column'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: screenW < 1180 && '100%', margin: screenW < 1180 ? '20px auto' : '30px auto' }}>
                            <TextField
                                className   = 'account-count-textfield'
                                label       = 'Mennyiség'
                                type        = 'number'
                                value       = { quantity }
                                onChange    = { handleQuantityChange }
                                InputProps  = {{
                                    endAdornment: <InputAdornment position="end">{articleLockerUnit}</InputAdornment>,
                                }}
                            />
                        </div>
                    </Container>
                </Container>
                <Container sx= {{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', flexDirection: screenW >= 1180 ? 'row' : 'column' }}>
                    <Button 
                        variant     = 'contained' 
                        color       = 'success' 
                        endIcon     = {<PlaylistAddCheckIcon/>} 
                        size        = 'large'
                        onClick     = { handleCheckQuantity }
                        disabled    = { qrCodeDataActLockerPlace === '' || qrCodeDataTargetLockerPlace === '' || quantity <= 0 }
                        sx          = {{ width: '150px', marginBottom: screenW < 1180 && '10px' }} 
                    >
                        Ellenőriz
                    </Button>
                    <Button 
                        variant     = 'contained' 
                        endIcon     = {<MoveDownIcon/>} 
                        size        = 'large'
                        onClick     = { handleSave }
                        disabled    = { isNotSaveable }
                        sx          = {{ width: '150px' }} 
                    >
                        Könyvel
                    </Button>
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
    );
}