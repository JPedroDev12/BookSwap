import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Inicial from './pages/pInicial';
import Login from './pages/pLogin';
import Register from './pages/pRegister';
import Perfil from "./pages/Pperfil"
import Loja from "./pages/pLoja"
import Swapping from "./pages/pSwapping"
import Chat from "./pages/pChat"
import Livro from "./pages/pLivro"

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

        {/* Rota da Loja */}
        <Route path="/loja" element={<Loja/>} />

        {/* Rota do Swapping (deslizar/curtir livros) */}
        <Route path="/swapping" element={<Swapping/>} />

        {/* Rota do Chat (conversar com quem deu match) */}
        <Route path="/chat" element={<Chat/>} />
        <Route path="/chat/:id" element={<Chat/>} />

        {/* Rota da Página de Detalhes do Livro */}
        <Route path="/livro/:id" element={<Livro/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);