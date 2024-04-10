import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Blogs from './pages/Blogs';
import Create from './pages/Create';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
              <Route path='/' element={ <Blogs />}/>
              <Route path='/create' element={ <Create />}/>
      </Routes>      
  </BrowserRouter>
  );
}

export default App;
