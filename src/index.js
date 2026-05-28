import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TableSelect from './items/TableSelect';
import Preferences from './items/Preferences';
import Recommendations from './items/Recommendations';
import Payment from './items/Payment';
import Cart from './items/cart';
import OrderTracking from './items/OrderTracking';






const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/TableSelect" element={<TableSelect/>} />
        <Route path="/Preferences" element={<Preferences/>}/>
        <Route path="/Recommendations" element={<Recommendations/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path ="/track"  element={<OrderTracking/>}/>
      </Routes>
    </Router>
);
