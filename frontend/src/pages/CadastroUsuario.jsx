import React, { useState } from 'react';

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    // Campos da Tabela: usuario
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    data_nascimento: '',
    telefone: '',
    qnt_gestacao: 0,
    
    // Campos da Tabela: gestacao
    estaGestante: false,
    ultima_mestruacao: '',
    idade_gestacional: '',
    data_parto: '',
    tipo_gestacao: '',
    pre_natal: false
  });

  const [erroSenha, setErroSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroApi, setErroApi] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroSenha('');
    setMensagemSucesso('');
    setErroApi('');

    // Validação básica de confirmação de senha no Front-end
    if (formData.senha !== formData.confirmarSenha) {
      setErroSenha('As senhas não coincidem!');
      return;
    }

    // Estrutura do payload no formato esperado pelo UsuarioCadastroDTO no Spring Boot
    const payload = {
      usuario: {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha, // A encriptação com BCrypt ocorre no Back-end
        data_nascimento: formData.data_nascimento || null,
        telefone: formData.telefone || null,
        qnt_gestacao: parseInt(formData.qnt_gestacao, 10) || 0
      },
      gestacao: formData.estaGestante ? {
        ultima_mestruacao: formData.ultima_mestruacao,
        idade_gestacional: formData.idade_gestacional ? parseInt(formData.idade_gestacional, 10) : null,
        data_parto: formData.data_parto || null,
        tipo_gestacao: formData.tipo_gestacao || null,
        pre_natal: formData.pre_natal
      } : null
    };

    try {
      // Envio para a API do Spring Boot
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensagemSucesso('Cadastro realizado com sucesso!');
        // Opcional: Limpar formulário após o sucesso
        setFormData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          data_nascimento: '',
          telefone: '',
          qnt_gestacao: 0,
          estaGestante: false,
          ultima_mestruacao: '',
          idade_gestacional: '',
          data_parto: '',
          tipo_gestacao: '',
          pre_natal: false
        });
      } else {
        const erroMsg = await response.text();
        setErroApi(erroMsg || 'Erro ao realizar o cadastro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setErroApi('Não foi possível se conectar ao servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-800">
          Cadastro da Mãe / Usuário 🌸
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Crie sua conta para iniciar o acompanhamento gestacional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
          {mensagemSucesso && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm">
              {mensagemSucesso}
            </div>
          )}

          {erroApi && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-sm">
              {erroApi}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* SEÇÃO 1: DADOS PESSOAIS */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
                Dados Pessoais
              </h3>
              
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Senha *</label>
                  <input
                    type="password"
                    name="senha"
                    required
                    value={formData.senha}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Confirmar Senha *</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    required
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Quantidade de Gestações Anteriores</label>
                  <input
                    type="number"
                    name="qnt_gestacao"
                    min="0"
                    value={formData.qnt_gestacao}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>
              </div>

              {erroSenha && (
                <p className="mt-2 text-sm text-rose-600 font-medium">{erroSenha}</p>
              )}
            </div>

            {/* SEÇÃO 2: DADOS DA GESTAÇÃO */}
            <div className="pt-4">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-slate-700">
                  Informações da Gestação Atual
                </h3>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="estaGestante"
                    checked={formData.estaGestante}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-slate-600 font-medium">Estou gestante</span>
                </label>
              </div>

              {formData.estaGestante && (
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 bg-rose-50/50 p-4 rounded-lg border border-rose-100">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Última Menstruação *</label>
                    <input
                      type="date"
                      name="ultima_mestruacao"
                      required={formData.estaGestante}
                      value={formData.ultima_mestruacao}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Idade Gestacional (Semanas)</label>
                    <input
                      type="number"
                      name="idade_gestacional"
                      min="1"
                      max="42"
                      placeholder="Ex: 12"
                      value={formData.idade_gestacional}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Previsão do Parto</label>
                    <input
                      type="date"
                      name="data_parto"
                      value={formData.data_parto}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Tipo de Gestação</label>
                    <select
                      name="tipo_gestacao"
                      value={formData.tipo_gestacao}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="Unica">Única</option>
                      <option value="Gemeos">Gêmeos</option>
                      <option value="Trigemeos_ou_mais">Trigêmeos ou mais</option>
                    </select>
                  </div>

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
                      Já está realizando acompanhamento Pré-natal?
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÃO DE SUBMIT */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-rose-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
              >
                Cadastrar Usuário
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}