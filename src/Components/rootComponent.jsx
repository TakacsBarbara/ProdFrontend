import React, {useContext} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { UserContext } from '../Global/UserContext';

import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Toolbar from './Toolbar/Toolbar';
import DoBDE from './Production/BDE/DoBDE';
import TicketPrint from './Production/TicketPrint/TicketPrint';
import Assembly from './Production/Assembly/Assembly';
import MaterialBooking from './Warehouse/MaterialBooking';
import MaterialPlan from './Warehouse/MaterialPlan';
import StockInfo from './Warehouse/StockInfo';
import CuttingInfo from './Warehouse/CuttingInfo';
import Reports from './Reports/Reports';
import ProdCenter from './Production/BDE/DoBDE/ViewWO/ProdCenter';
import Sarzs from './Production/Sarzs/Sarzs';

export default function RootComponent() {
  const [user, setUser] = useContext(UserContext);

  return (
    user.id !== null ? (
      <Router>
        <Toolbar/>
        <Routes>
          <Route exact path='/'                     element={<Dashboard/>}/>
          <Route exact path='/home'                 element={<Dashboard/>}/>
          <Route exact path='/do-bde'               element={<DoBDE/>}/>
          <Route exact path='/ticket-print'         element={<TicketPrint/>}/>
          <Route exact path='/assembly'             element={<Assembly/>}/>
          <Route exact path='/material-booking'     element={<MaterialBooking/>}/>
          <Route exact path='/material-plan'        element={<MaterialPlan/>}/>
          <Route exact path='/stock-info'           element={<StockInfo/>}/>
          <Route exact path='/cutting-info'         element={<CuttingInfo/>}/>
          <Route exact path='/prod-center/:id'      element={<ProdCenter/>}/>
          <Route exact path='/reports'              element={<Reports/>}/>
          <Route exact path='/sarzs'                element={<Sarzs/>}/>
          <Route exact path='*'                     element={<Dashboard/>}/>
        </Routes>
      </Router>
      ) : (
        <Router>
          <Routes>
            <Route exact path='*'     element={<Login/>}/>
          </Routes>
      </Router> 
      )
    );
}
