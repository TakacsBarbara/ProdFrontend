import React from 'react';
import { UserProvider } from './Global/UserContext';
import { WorkOrdersProvider } from './Global/WorkOrdersContext';
import { SelectsProvider } from './Global/SelectsContext';
import RootComponent from './Components/rootComponent';

function App() {
  return (
    <UserProvider>
      <SelectsProvider>
        <WorkOrdersProvider>
          <RootComponent />
        </WorkOrdersProvider>
      </SelectsProvider>
    </UserProvider>
  )
}

export default App;
