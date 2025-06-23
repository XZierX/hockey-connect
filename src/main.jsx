import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Torneios from './Torneios.jsx';
import Times from './Times.jsx';
import Jogadores from './Jogadores.jsx';
import Menu from './Menu';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/torneios" element={<Torneios />} />
        <Route path="/times" element={<Times />} />
        <Route path="/jogadores" element={<Jogadores />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
