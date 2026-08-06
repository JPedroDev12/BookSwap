import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicial from './pages/pInicial';
import Login from './pages/pLogin';
import Register from './pages/pRegister';
import Perfil from "./pages/Pperfil"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota da Página Inicial */}
        <Route path="/" element={<Inicial />} />
        
        {/* Rota da Página de Login */}
        <Route path="/pLogin" element={<Login />} />

        {/* Rota da Página de Registro */}
        <Route path="/pRegister" element={<Register/>} />

        {/* Rota da Página de Perfil */}
        <Route path="/pPerfil/:id" element={<Perfil/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);