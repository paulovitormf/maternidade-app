import api from './api';

export interface UsuarioData {
  nome: string;
  email: string;
  senha: string;
  data_nascimento?: string;
  telefone?: string;
  qnt_gestacao?: number;
}

export interface GestacaoData {
  ultima_mestruacao: string;
  idade_gestacional?: number | null;
  tipo_gestacao?: string;
  pre_natal?: boolean;
}

export interface CadastroUsuarioPayload {
  usuario: UsuarioData;
  gestacao?: GestacaoData | null;
}

export interface UsuarioPublico {
  id_usuario: number;
  nome: string;
  email: string;
  data_nascimento?: string;
  telefone?: string;
  qnt_gestacao?: number;
}

export const cadastrarUsuario = async (dadosUsuario: CadastroUsuarioPayload) => {
  const response = await api.post<UsuarioPublico>('/usuarios', dadosUsuario);
  return response.data;
};

export const loginUsuario = async (dadosLogin: { email: string; senha: string }) => {
  const response = await api.post<UsuarioPublico>('/usuarios/login', dadosLogin);
  return response.data;
};