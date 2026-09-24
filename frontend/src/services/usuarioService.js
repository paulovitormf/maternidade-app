import api from './api';

export const cadastrarUsuario = async (dadosUsuario) => {
  const response = await api.post('/usuarios', dadosUsuario);

  return response.data;
};

export const loginUsuario = async (dadosLogin) => {
  const response = await api.post('/usuarios/login', dadosLogin);

  return response.data;
};