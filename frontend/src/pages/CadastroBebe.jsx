import React, { useState } from 'react';
import api from '../services/api';

export default function CadastroBebe() {
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    horaNascimento: '',
    sexo: 'F',
    pesoNascimento: '',
    alturaNascimento: '',
    previsaoNascimento: '',
    observacoes: ''
  });

  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      // Ajuste os tipos numéricos antes de enviar para o Java (Spring Boot)
      const payload = {
        ...formData,
        pesoNascimento: formData.pesoNascimento ? parseFloat(formData.pesoNascimento) : null,
        alturaNascimento: formData.alturaNascimento ? parseFloat(formData.alturaNascimento) : null,
      };

      // Rota configurada no Controller do Spring Boot
      await api.post('/criancas', payload); 
      
      setMensagem({ tipo: 'sucesso', texto: 'Bebê cadastrado com sucesso!' });
      setFormData({
        nome: '', dataNascimento: '', horaNascimento: '', sexo: 'F',
        pesoNascimento: '', alturaNascimento: '', previsaoNascimento: '', observacoes: ''
      });
    } catch (error) {
      setMensagem({
        tipo: 'erro',
        texto: error.response?.data?.message || 'Erro ao realizar o cadastro. Verifique os dados.'
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Perfil do Bebê</h2>
          <p className="text-slate-500">Registre as informações de nascimento da criança.</p>
        </div>

        {mensagem.texto && (
          <div className={`p-4 mb-6 rounded-lg font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Criança *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
            />
          </div>

          {/* Grid: Data, Hora e Sexo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento *</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hora do Nascimento *</label>
              <input
                type="time"
                name="horaNascimento"
                value={formData.horaNascimento}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sexo Biológico</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
          </div>

          {/* Grid: Peso, Altura e Previsão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                name="pesoNascimento"
                value={formData.pesoNascimento}
                onChange={handleChange}
                placeholder="Ex: 3.25"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                name="alturaNascimento"
                value={formData.alturaNascimento}
                onChange={handleChange}
                placeholder="Ex: 49.5"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Previsão do Parto *</label>
              <input
                type="date"
                name="previsaoNascimento"
                value={formData.previsaoNascimento}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações (Opcional)</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
              placeholder="Detalhes sobre o parto, tipo sanguíneo, saúde..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors duration-200"
            >
              {carregando ? 'Salvando Registro...' : 'Registrar Bebê'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}