import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroCrianca from './pages/CadastroCrianca';
import CadastroGestacao from './pages/CadastroGestacao';
// import TestePaletas from './pages/TestePaletas'; // Se houver no seu projeto

export default function App() {
  return (
    <Router>
      {/* Menu/Barra de Navegação Temporária para Testes */}
      <nav className="bg-slate-800 text-white p-4 flex gap-4 text-sm justify-center">
        <Link to="/cadastro-mae" className="hover:underline">
          Cadastro da Mãe
        </Link>
        <Link to="/cadastro-bebe" className="hover:underline">
          Cadastro do Bebê
        </Link>
        <Link to="/cadastro-gestacao" className="hover:underline">
          Cadastro da Gestação
        </Link>
      </nav>

      {/* Mapeamento das Rotas */}
      <Routes>
        <Route path="/" element={<CadastroUsuario />} />
        <Route path="/cadastro-mae" element={<CadastroUsuario />} />
        <Route path="/cadastro-bebe" element={<CadastroCrianca />} />
        <Route path="/cadastro-gestacao" element={<CadastroGestacao />} />
      </Routes>
    </Router>
  );
}