import React, { useState } from 'react';
import { Button, Container, Divider} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCommentIcon from '@mui/icons-material/AddComment';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import MaterialInput from './MaterialInput';
import Files from './Files';
import BDE from './BDE';
import BOM from './BOM';

const desktopStyle = {
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '10px'
    }
}

const mobileStyle = {
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: '10px'
    }
}

export default function ToolBar({ WOIndex, screenW }) {
    const [activeTab, setActiveTab]  = useState('bde');

    return(
        <Container sx={{ maring: 'auto', maxWidth: '100% !important', textAlign: 'center', padding: '0 !important' }}>
            <Container
                className='bde-toolbar-button-container'
                sx={ screenW < 690 ? mobileStyle.buttonsContainer : desktopStyle.buttonsContainer }
            >
                <Button
                    size    = 'large'
                    variant = {activeTab === 'bde' ? 'contained' : 'outlined'}
                    onClick = {(e) => (setActiveTab('bde'))}
                    endIcon = {<PersonAddIcon/>}
                    sx      = {{ width:'200px', m: 1 }}
                >BDE</Button>
                {/* <Button
                    disabled
                    size    = 'large'
                    variant = {activeTab === 'material' ? 'contained' : 'outlined'}
                    onClick = {(e) => (setActiveTab('material'))}
                    endIcon = {<AddShoppingCartIcon/>}
                    sx      = {{ width:'200px', m: 1 }}
                >Visszajelentés</Button> */}
                <Button
                    size    = 'large'
                    variant = {activeTab === 'files' ? 'contained' : 'outlined'}
                    onClick = {(e) => (setActiveTab('files'))}
                    endIcon = {<DescriptionIcon/>}
                    sx      = {{ width:'200px', m: 1 }}
                >Fájlok</Button>
                <Button
                    disabled
                    size    = 'large'
                    variant = {activeTab === 'notes' ? 'contained' : 'outlined'}
                    onClick = {(e) => (setActiveTab('notes'))}
                    endIcon = {<AddCommentIcon/>}
                    sx      = {{ width:'200px', m: 1 }}
                >Megjegyzések</Button>
                <Button
                    size    = 'large'
                    variant = {activeTab === 'bom' ? 'contained' : 'outlined'}
                    onClick = {(e) => (setActiveTab('bom'))}
                    endIcon = {<TableChartIcon/>}
                    sx      = {{ width:'200px', m: 1 }}
                >BOM</Button>
            </Container>
            <Divider sx={{ margin: '30px auto 30px' }} />
            <Container
                sx={{
                    width: '100%',
                    minHeight: '350px',
                    marginTop: '2rem',
                    padding: screenW < 680 && '0 !important'
                }}
            >
                {activeTab === 'bde' && <BDE WOIndex = {WOIndex} screenW={screenW} />}
                {activeTab === 'files' && <Files WOIndex = {WOIndex} screenW={screenW} />}
                {activeTab === 'material' && <MaterialInput WOIndex = {WOIndex}/>}
                {activeTab === 'bom' && <BOM WOIndex = {WOIndex}/>}
                {/* {activeTab === 'notes' ?? <NotesTab/>} */}
            </Container>
        </Container>

    )


}