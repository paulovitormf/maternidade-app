import api from './api';

export type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  dataAgendada: string;
  status: string;
};

export async function listarNotificacoes() {
  const response = await api.get<Notificacao[]>('/notificacoes');
  return response.data;
}

export async function marcarNotificacoesComoLidas() {
  await api.put('/notificacoes/ler');
}
