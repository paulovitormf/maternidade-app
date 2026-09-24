import { FormEvent, useState } from 'react';
import type React from 'react';
import api from '../services/api';

export default function CadastroGestacao({ idUsuario }: { idUsuario?: number }) {
  const [formData, setFormData] = useState({
    ultima_mestruacao: '',
    idade_gestacional: '',
    tipo_gestacao: 'Unica',
    pre_natal: false
  });

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroApi, setErroApi] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMensagemSucesso('');
    setErroApi('');

    const payload = {
      id_usuario: idUsuario ?? Number(localStorage.getItem('id_usuario')),
      ultima_mestruacao: formData.ultima_mestruacao,
      idade_gestacional: formData.idade_gestacional ? parseInt(formData.idade_gestacional, 10) : null,
      tipo_gestacao: formData.tipo_gestacao || 'Unica',
      pre_natal: formData.pre_natal
    };
    if (!Number.isInteger(payload.id_usuario) || payload.id_usuario <= 0) {
      setErroApi('Faça login antes de cadastrar uma gestação.');
      return;
    }

    try {
      await api.post('/gestacoes', payload);
      {
        setMensagemSucesso('Dados da gestação salvos com sucesso!');
        setFormData({
          ultima_mestruacao: '',
          idade_gestacional: '',
          tipo_gestacao: 'Unica',
          pre_natal: false
        });
      }
    } catch {
      setErroApi('Não foi possível se conectar ao servidor.');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 bg-white p-6 shadow sm:rounded-lg border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">
        Registro de Gestação 🤰
      </h2>

      {mensagemSucesso && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm font-medium">
          {mensagemSucesso}
        </div>
      )}

      {erroApi && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-sm font-medium">
          {erroApi}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
          
          {/* Data da Última Menstruação */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Data da Última Menstruação (DUM) *</label>
            <input
              type="date"
              name="ultima_mestruacao"
              required
              value={formData.ultima_mestruacao}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
            />
          </div>

          {/* Idade Gestacional em Semanas */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Idade Gestacional (Semanas)</label>
            <input
              type="number"
              name="idade_gestacional"
              min="1"
              max="42"
              placeholder="Ex: 14"
              value={formData.idade_gestacional}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
            />
          </div>

          {/* Tipo de Gestação */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Tipo de Gestação</label>
            <select
              name="tipo_gestacao"
              value={formData.tipo_gestacao}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
            >
              <option value="Unica">Única</option>
              <option value="Gemeos">Gêmeos</option>
              <option value="Trigemeos_ou_mais">Trigêmeos ou mais</option>
            </select>
          </div>

          {/* Acompanhamento Pré-natal */}
          <div className="sm:col-span-2 flex items-center mt-2">
            <input
              type="checkbox"
              id="pre_natal"
              name="pre_natal"
              checked={formData.pre_natal}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="pre_natal" className="ml-2 block text-sm text-slate-700">
              Já realiza acompanhamento médico Pré-natal?
            </label>
          </div>

        </div>

        <button
          type="submit"
          className="w-full mt-4 justify-center rounded-md border border-transparent bg-rose-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
        >
          Salvar Dados da Gestação
        </button>
      </form>
    </div>
  );
}