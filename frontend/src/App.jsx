import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroBebe from './pages/CadastroCrianca';

export default function App() {
  return (
    <BrowserRouter>

      <nav className="bg-slate-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex gap-6">
          
          <Link to="/">Início</Link>

          <Link to="/login">Login</Link>

          <Link to="/cadastrar-usuario">
            Cadastrar Mãe
          </Link>

          <Link to="/cadastrar-bebe">
            Cadastrar Bebê
          </Link>

        </div>
      </nav>

      <main className="container mx-auto p-4">

        <Routes>

          {/* ROTA DO LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* ROTA INICIAL */}
          <Route
            path="/"
            element={
              <h1 className="text-2xl font-bold text-center mt-10">
                Painel Principal - Maternidade App
              </h1>
            }
          />

          {/* CADASTRO */}
          <Route
            path="/cadastrar-usuario"
            element={<CadastroUsuario />}
          />

          <Route
            path="/cadastrar-bebe"
            element={<CadastroBebe />}
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}