import api from './api';

export const cadastrarUsuario = async (dadosUsuario) => {
  const response = await api.post('/usuarios', dadosUsuario); // Ajuste a rota para a controller do Spring Boot
  return response.data;
};