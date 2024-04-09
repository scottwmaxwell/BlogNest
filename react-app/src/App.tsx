import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
              <Route path='/' element={ <Home />}/>
              {/* <Route path='/discover' element={<Discover />} /> */}
      </Routes>      
  </BrowserRouter>
  );
}

export default App;
