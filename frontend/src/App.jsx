import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroBebe from './pages/CadastroBebe';
// import CadastroGestacao from './pages/CadastroGestacao'; // Descomente quando tiver essa tela

export default function App() {
  return (
    <BrowserRouter>
      {/* Menu Superior de Navegação */}
      <nav className="bg-slate-800 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex gap-6 font-medium">
          <Link to="/" className="hover:text-pink-400 transition">
            Início
          </Link>
          <Link to="/cadastrar-usuario" className="hover:text-pink-400 transition">
            Cadastrar Mãe
          </Link>
          <Link to="/cadastrar-bebe" className="hover:text-pink-400 transition">
            Cadastrar Bebê
          </Link>
        </div>
      </nav>

      {/* Gerenciador de Rotas (onde os componentes são renderizados) */}
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-center mt-10 text-slate-800">Painel Principal - Maternidade App</h1>} />
          <Route path="/cadastrar-usuario" element={<CadastroUsuario />} />
          <Route path="/cadastrar-bebe" element={<CadastroBebe />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}