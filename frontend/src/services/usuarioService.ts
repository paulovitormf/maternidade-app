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

export const USUARIO_STORAGE_KEY = 'usuario_autenticado';
export const CONTINUAR_CADASTRO_STORAGE_KEY = 'maternidade_continuar_cadastro';
export const AUTH_CHANGED_EVENT = 'maternidade-auth-changed';

export interface LoginResposta {
  token: string;
  usuario: UsuarioPublico;
}

export const cadastrarUsuario = async (dadosUsuario: CadastroUsuarioPayload) => {
  const response = await api.post<UsuarioPublico>('/usuarios', dadosUsuario);
  return response.data;
};

export const loginUsuario = async (dadosLogin: { email: string; senha: string }) => {
  const response = await api.post<LoginResposta>('/usuarios/login', dadosLogin);
  return response.data;
};

export const verificarEmail = async (dados: { email: string; codigo: string }) => {
  const response = await api.post<{ mensagem: string }>('/usuarios/verificar-email', dados);
  return response.data;
};

export const reenviarVerificacaoEmail = async (email: string) => {
  const response = await api.post<{ mensagem: string }>('/usuarios/reenviar-verificacao', { email });
  return response.data;
};