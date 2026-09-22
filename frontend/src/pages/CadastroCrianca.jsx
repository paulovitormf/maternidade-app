import React, { useState } from 'react';

export default function CadastroCrianca() {
  const [formData, setFormData] = useState({
    // Campos da Tabela: crianca
    nome: '',
    data_nascimento: '',
    hora_nascimento: '',
    sexo: 'F',
    peso_nascimento: '',
    altura_nascimento: '',
    observacoes: '',
    
    // Campo da Tabela: usuario_crianca
    tipo_relacao: 'MAE'
  });

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroApi, setErroApi] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemSucesso('');
    setErroApi('');

    // Formatação do payload para o DTO do Back-end (Spring Boot)
    const payload = {
      nome: formData.nome,
      data_nascimento: formData.data_nascimento,
      hora_nascimento: formData.hora_nascimento ? `${formData.hora_nascimento}:00` : null,
      sexo: formData.sexo,
      peso_nascimento: formData.peso_nascimento ? parseFloat(formData.peso_nascimento) : null,
      altura_nascimento: formData.altura_nascimento ? parseFloat(formData.altura_nascimento) : null,
      observacoes: formData.observacoes || null,
      tipo_relacao: formData.tipo_relacao
    };

    try {
      // Endpoint a ser criado no Spring Boot
      const response = await fetch('http://localhost:8080/api/criancas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Exemplo se usar autenticação JWT
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensagemSucesso('Registro do bebê/criança salvo com sucesso!');
        setFormData({
          nome: '',
          data_nascimento: '',
          hora_nascimento: '',
          sexo: 'F',
          peso_nascimento: '',
          altura_nascimento: '',
          observacoes: '',
          tipo_relacao: 'MAE'
        });
      } else {
        const erroMsg = await response.text();
        setErroApi(erroMsg || 'Erro ao registrar os dados do bebê.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setErroApi('Não foi possível conectar ao servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-800">
          Cadastro do Bebê 👶
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Registre as informações do seu bebê para acompanhamento de crescimento e rotina
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* SEÇÃO: VÍNCULO */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
                Vínculo Familiar
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700">Seu Grau de Parentesco / Relação *</label>
                <select
                  name="tipo_relacao"
                  value={formData.tipo_relacao}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                >
                  <option value="MAE">Mãe</option>
                  <option value="PAI">Pai</option>
                  <option value="RESPONSAVEL">Responsável Legal</option>
                </select>
              </div>
            </div>

            {/* SEÇÃO: DADOS DA CRIANÇA */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
                Dados do Bebê
              </h3>

              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Nome do Bebê *</label>
                  <input
                    type="text"
                    name="nome"
                    required
                    placeholder="Ex: Clara Silva"
                    value={formData.nome}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Sexo *</label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>

        

                {/* Data de Nascimento Real */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Data de Nascimento *</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    required
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                {/* Hora de Nascimento */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Horário de Nascimento *</label>
                  <input
                    type="time"
                    name="hora_nascimento"
                    required
                    value={formData.hora_nascimento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                {/* Peso ao Nascer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Peso ao Nascer (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="peso_nascimento"
                    placeholder="Ex: 3.25"
                    value={formData.peso_nascimento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                {/* Altura ao Nascer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Altura ao Nascer (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="altura_nascimento"
                    placeholder="Ex: 48.5"
                    value={formData.altura_nascimento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

                {/* Observações */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Observações Clínicas / Gerais</label>
                  <textarea
                    name="observacoes"
                    rows="3"
                    placeholder="Tipo de parto, tipo sanguíneo, particularidades médicas, etc."
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
                  />
                </div>

              </div>
            </div>

            {/* BOTÃO SUBMIT */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-rose-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors"
              >
                Cadastrar Bebê
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}