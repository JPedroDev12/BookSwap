import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicial from './pages/pInicial';
import Login from './pages/pLogin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota da Página Inicial */}
        <Route path="/" element={<Inicial />} />
        
        {/* Rota da Página de Login */}
        <Route path="/pLogin" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);