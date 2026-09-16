import { useEffect, useState } from 'react';
import { Baby, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface HelloData {
  id: number;
  texto: string;
}

export default function App() {
  const [data, setData] = useState<HelloData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHello = () => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:8080/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error('Servidor respondeu com erro');
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => setError('Não foi possível conectar com o backend Spring Boot.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100">
      {/* Container simulando tela de smartphone (Mobile-First) */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 p-6 text-center flex flex-col items-center">
        
        {/* Ícone principal */}
        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Baby className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-slate-800">App Maternidade</h1>
        <p className="text-xs text-slate-500 mb-6">Validação de Arquitetura de Software</p>

        {/* Estado de Carregamento */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500 my-6">
            <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
            <span>Buscando dados no MySQL...</span>
          </div>
        )}

        {/* Estado de Erro */}
        {error && !loading && (
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-xs flex items-center gap-2 mb-6 w-full text-left">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Exibição da resposta vinda do banco */}
        {data && !loading && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl w-full mb-6">
            <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sucesso! Resposta do Banco:</span>
            </div>
            <p className="text-sm font-medium text-slate-700">"{data.texto}"</p>
          </div>
        )}

        {/* Botão para testar a requisição */}
        <button
          onClick={fetchHello}
          disabled={loading}
          className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 active:scale-95 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-pink-200"
        >
          Testar Requisição Novamente
        </button>
      </div>
    </main>
  );
}