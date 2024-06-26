import React, {useContext, useEffect, useState} from 'react';
import { WorkOrdersContext } from '../../../../../Global/WorkOrdersContext';
import * as ArticleAPI from '../../../../../API/ArticelAPI';
import './../../../../../App.css';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Container, Button, ImageList, ImageListItem } from '@mui/material';

export default function Files({ WOIndex, screenW }) {
    const [workOrders, setWorkOrders] = useContext(WorkOrdersContext);

    const [cutlist, setCutlist]         = useState([]);
    const [cdwg, setCdwg]               = useState([]);
    const [adwg, setAdwg]               = useState([]);
    const [cellainfo, setCellainfo]     = useState([]);
    const [pic, setPic]                 = useState([]);

    useEffect(() => {
        if (workOrders[WOIndex].article !== ''){
            console.log(workOrders[WOIndex].article);
            ArticleAPI.onArticleCutlistRequested    (workOrders[WOIndex].article).then(response => {setCutlist(response)});
            ArticleAPI.onArticleCdwgRequested       (workOrders[WOIndex].article).then(response => {setCdwg(response)});
            ArticleAPI.onArticleAdwgRequested       (workOrders[WOIndex].article).then(response => {setAdwg(response)});
            ArticleAPI.onArticleCellaInfoRequested  (workOrders[WOIndex].article).then(response => {setCellainfo(response)});
            ArticleAPI.onArticlePicRequested        (workOrders[WOIndex].article).then(response => {setPic(response)});
        }
    }, [workOrders, WOIndex]);

    return(
        <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', marginBottom:'1rem', padding: screenW < 680 && '0 !important'}}>
             {/* <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: screenW < 680 ? '0 !important' : '0.25rem'}}>
                <Button
                    variant='outlined'
                    color='primary'
                    size='large'
                    endIcon={<PictureAsPdfIcon/>}
                    onClick={(e) => {window.open(`${process.env.REACT_APP_BASE_URL}/work-order-files/${workOrders[WOIndex].workOrderNumber}.pdf`)}}
                >Gyártási Törzslap</Button>
            </Container> */}
            { cutlist.length !== 0 && <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: screenW < 680 ? '0 !important' : '0.25rem', flexWrap: 'wrap', flexDirection: 'row'}}>
                {cutlist.map( (file, index) => (
                    <Button
                        key={`cutlist_ + ${index}`}
                        variant='outlined'
                        color='secondary'
                        size='large'
                        endIcon={<FilePresentIcon/>}
                        onClick={(e) => {window.open(file.path)}}
                        sx={ screenW <= 679 ? {marginTop: '1em'} : {undefined} }
                    >{file.fileName}</Button>
                ))}
            </Container>}
            { adwg.length !== 0 && <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '0.25rem', flexWrap: 'wrap', flexDirection: 'row'}}>
                {adwg.map( (file, index) => (
                    <Button
                        key={`adwg_ + ${index}`}
                        variant='outlined'
                        color='primary'
                        size='large'
                        endIcon={<PictureAsPdfIcon/>}
                        onClick={(e) => {window.open(file.path)}}
                        sx={ screenW <= 679 ? {marginTop: '1em'} : {undefined} }
                    >{file.fileName}</Button>
                ))}
            </Container>}
            { cdwg.length !== 0 && <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '0.25rem', flexWrap: 'wrap', flexDirection: 'row'}}>
                {cdwg.map( (file, index) => (
                    <Button
                        key={`cdwg_ + ${index}`}
                        variant='outlined'
                        color='primary'
                        size='large'
                        endIcon={<PictureAsPdfIcon/>}
                        onClick={(e) => {window.open(file.path)}}
                        sx={ screenW <= 679 ? {marginTop: '1em'} : {undefined} }
                    >{file.fileName}</Button>
                ))}
            </Container>}
            { cellainfo.length !== 0 && <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '0.25rem', flexWrap: 'wrap', flexDirection: 'row'}}>
                {cellainfo.map( (file, index) => (
                    <Button
                        key={`cellainfo_ + ${index}`}
                        variant='outlined'
                        color='primary'
                        size='large'
                        endIcon={<PictureAsPdfIcon/>}
                        onClick={(e) => {window.open(file.path)}}
                        sx={ screenW <= 679 ? {marginTop: '1em'} : {undefined} }
                    >{file.fileName}</Button>
                ))}
            </Container>}
            <ImageList sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', flexWrap: 'wrap', flexDirection: 'row'}}>
                {pic.map(file => (
                    <ImageListItem className='bde-image-list-item' key={file.path} >
                        <img
                            className='bde-image-item'
                            alt={file.fileName}
                            src={file.path}
                            loading='lazy'
                            onClick={(e) => {window.open(file.path)}}
                            style={{ marginTop: screenW <= 679 ? '1em' : ''}}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            {/* <Container className="video-container">
                <iframe
                    id="youtube-iframe"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/fa01jtZDYbM"
                    title="ACSG video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowfullscreen
                ></iframe>
            </Container> */}
        </Container>
    )
}

