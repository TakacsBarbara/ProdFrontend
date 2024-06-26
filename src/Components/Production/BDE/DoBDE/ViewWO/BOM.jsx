import React, { useContext, useState, useEffect } from 'react';
import { WorkOrdersContext } from '../../../../../Global/WorkOrdersContext';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';
import '../../../../../TableCuttingInfo.css';

const BOM = ({ WOIndex }) => {

  const [workOrders, setWorkOrders] = useContext(WorkOrdersContext);
  const [bom, setBom] = useState([]);

  useEffect(() => {

      if (workOrders[WOIndex].workOrderNumber !== '') {
        setBom(workOrders[WOIndex].BOM.slice(1));
      }

  }, [workOrders, WOIndex]);

  return (
      <TableContainer className='bom-table' component={Paper} sx={{ overflowY: 'auto', width: '100%', margin: '40px auto 10px', maxHeight: '800px'}} >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Poz</TableCell>
              <TableCell>Árucikk/Művelet/Gyártóeszköz</TableCell>
              <TableCell align="right">Mennyiség/Elők. idő DB idő</TableCell>
              <TableCell align="right">ÖsszMenny ta [h]</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bom.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index+1}
                </TableCell>
                <TableCell>
                    <Typography variant="h6">{row.article}</Typography>
                    <Typography>{row.articleDescription}</Typography>
                </TableCell>
                <TableCell align="right">{ !row.article.includes('A') ? `${row.prodQuantity ? row.prodQuantity + " " : "0 "} ${row.prodQuantity && row.prodUnit}` : `${row.prodTimeMin ? row.prodTimeMin + " " : "0 "}${row.prodTimeMinUnit} ${row.prodTimeSec ? row.prodTimeSec + " " : "0 "}${row.prodTimeSecUnit}` }</TableCell>
                <TableCell align="right">{ !row.article.includes('A') ? `${row.quantity ? row.quantity : "0 "} ${row.unit}` : `${row.time ? row.time + " " : "0 "} ${row.unit}` }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default BOM;
