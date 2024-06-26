import * as React from 'react';
import { Dialog, DialogContent, DialogContentText, Box, LinearProgress } from '@mui/material';
import useWindowDimensions from '../../../../../Hooks/useWindowDimensions';

export default function InfoDialog({ open, text }) {

  const screen = useWindowDimensions();

  return (
    <Box>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {text === "Az Üzemi megbízás nem létezik!" ? (
          <DialogContent sx={{ width: screen.width > 470? '350px' : '200px', height: screen.width > 470? '50px' : '80px', textAlign: 'center', padding: screen.width > 470 ? '30px' : '20px' }}>
            <DialogContentText id="alert-dialog-description" sx={{ lineHeight:  screen.width > 470? '50px' : '35px', fontSize: '20px' }}>
              {text}
            </DialogContentText>
          </DialogContent>
        ) : (
          <DialogContent sx={{ width: screen.width > 470? '350px' : '200px', height: '50px', textAlign: 'center', padding: '30px 20px' }}>
            <DialogContentText id="alert-dialog-description">
              {text}
              <LinearProgress sx={{ marginTop: '20px' }} />
            </DialogContentText>
          </DialogContent>
        )
        }
      </Dialog>
    </Box>
  );
}