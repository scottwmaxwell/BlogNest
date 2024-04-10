import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Blogs from './pages/Blogs';
import Create from './pages/Create';
import BlogView from './pages/BlogView';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
              <Route path='/' element={ <Blogs />}/>
              <Route path='/create' element={ <Create />}/>
              <Route path='/blog/:id' element={<BlogView />} />
              <Route path='/edit/:id' element={<Create />} />
      </Routes>      
  </BrowserRouter>
  );
}

export default App;
