import { FormEvent, useMemo, useState } from 'react';
import type React from 'react';
import axios from 'axios';
import { HeartPulse } from 'lucide-react';
import api from '../services/api';

type GestacaoForm = {
  ultima_mestruacao: string;
  idade_gestacional: string;
  tipo_gestacao: string;
  pre_natal: boolean;
};

const initialForm: GestacaoForm = {
  ultima_mestruacao: '',
  idade_gestacional: '',
  tipo_gestacao: 'Unica',
  pre_natal: false,
};

const formatarData = (data: Date) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(data);

export default function CadastroGestacao({ idUsuario }: { idUsuario?: number }) {
  const [formData, setFormData] = useState<GestacaoForm>(initialForm);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked
      : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const previsaoParto = useMemo(() => {
    if (!formData.ultima_mestruacao) {
      return null;
    }

    const [ano, mes, dia] = formData.ultima_mestruacao.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    data.setDate(data.getDate() + 280);
    return Number.isNaN(data.getTime()) ? null : data;
  }, [formData.ultima_mestruacao]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMensagemSucesso('');
    setErroApi('');
    setCarregando(true);
    const usuario = idUsuario ?? Number(localStorage.getItem('id_usuario'));
    if (!Number.isInteger(usuario) || usuario <= 0) {
      setErroApi('Faça login antes de cadastrar uma gestação.');
      setCarregando(false);
      return;
    }

    const dum = new Date(`${formData.ultima_mestruacao}T00:00:00`);
    if (Number.isNaN(dum.getTime()) || dum > new Date()) {
      setErroApi('Informe uma data válida. A DUM não pode estar no futuro.');
      setCarregando(false);
      return;
    }

    try {
      await api.post('/gestacoes', {
        id_usuario: usuario,
        ultima_mestruacao: formData.ultima_mestruacao,
        idade_gestacional: formData.idade_gestacional ? Number(formData.idade_gestacional) : null,
        tipo_gestacao: formData.tipo_gestacao,
        pre_natal: formData.pre_natal,
      });
      setMensagemSucesso('Gestação salva! A previsão de parto foi calculada automaticamente.');
      setFormData(initialForm);
    } catch (error) {
      const mensagem = axios.isAxiosError(error) && typeof error.response?.data === 'string'
        ? error.response.data
        : 'Não foi possível salvar os dados. Confira as informações e tente novamente.';
      setErroApi(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="form-card card">
      <div className="mb-8">
        <span className="form-icon form-icon-blue mb-4"><HeartPulse size={28} strokeWidth={1.65} /></span>
        <p className="eyebrow">Acompanhamento</p>
        <h1 className="display-title !text-3xl">Registro da gestação</h1>
        <p className="page-subtitle">Informe a DUM e calcularemos a previsão de parto para você.</p>
      </div>
      {mensagemSucesso && <div className="alert-success mb-5">{mensagemSucesso}</div>}
      {erroApi && <div className="alert-error mb-5">{erroApi}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field field-wide">
          <span className="field-label">Data da última menstruação (DUM) *</span>
          <input
            className="field-control"
            type="date"
            name="ultima_mestruacao"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.ultima_mestruacao}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span className="field-label">Idade gestacional (semanas)</span>
          <input className="field-control" type="number" name="idade_gestacional" min="0" max="42" placeholder="Ex.: 14" value={formData.idade_gestacional} onChange={handleChange} />
        </label>
        <label className="field">
          <span className="field-label">Tipo de gestação</span>
          <select className="field-control" name="tipo_gestacao" value={formData.tipo_gestacao} onChange={handleChange}>
            <option value="Unica">Única</option>
            <option value="Gemeos">Gêmeos</option>
            <option value="Trigemeos_ou_mais">Trigêmeos ou mais</option>
          </select>
        </label>
        <label className="field-wide flex cursor-pointer items-center gap-3 rounded-2xl bg-[#EBF3F5] p-4">
          <input className="h-5 w-5 accent-[#C8526B]" type="checkbox" name="pre_natal" checked={formData.pre_natal} onChange={handleChange} />
          <span className="text-sm font-semibold text-[#3B7280]">Já realiza acompanhamento pré-natal?</span>
        </label>
        {previsaoParto && (
          <div className="field-wide rounded-2xl border border-[#FECDD3] bg-[#FADCE1] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#B0435B]">Previsão automática</p>
            <p className="mt-1 text-sm font-bold text-slate-800">
              Data provável do parto: {formatarData(previsaoParto)}
            </p>
            <p className="mt-1 text-xs text-slate-600">Cálculo estimado com base em 280 dias após a DUM.</p>
          </div>
        )}
        <button className="primary-button field-wide mt-2" type="submit" disabled={carregando}>
          {carregando ? 'Salvando gestação...' : 'Salvar dados da gestação'}
        </button>
      </form>
    </section>
  );
}
