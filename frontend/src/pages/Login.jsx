import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/usuarioService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setErro('');

    if (!email || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    try {
      setCarregando(true);

      const dadosLogin = {
        email,
        senha
      };

      const resposta = await loginUsuario(dadosLogin);

      console.log('Login realizado:', resposta);

      navigate('/');

    } catch (error) {
      console.error('Erro ao realizar login:', error);

      if (error.response) {
        setErro(
          error.response.data?.message ||
          error.response.data ||
          'E-mail ou senha inválidos.'
        );
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-slate-800">
            Maternidade
          </h1>

          <p className="mt-2 text-slate-500">
            Bem-vinda de volta!
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Entrar
          </h2>

          <form onSubmit={handleLogin}>

            <div className="mb-5">

              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3
                           text-slate-800 outline-none
                           focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

            </div>

            <div className="mb-5">

              <label
                htmlFor="senha"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-lg border border-slate-300 px-4 py-3
                           text-slate-800 outline-none
                           focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

            </div>

            {erro && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">
                  {erro}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-lg bg-pink-400 py-3
                         font-semibold text-white
                         transition hover:bg-pink-500
                         disabled:cursor-not-allowed
                         disabled:opacity-60"
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

          </form>

          <div className="text-center mt-6">

            <p className="text-sm text-slate-500">
              Ainda não possui uma conta?
            </p>

            <Link
              to="/cadastrar-usuario"
              className="inline-block mt-1 font-medium text-pink-500 hover:text-pink-600"
            >
              Criar conta
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}