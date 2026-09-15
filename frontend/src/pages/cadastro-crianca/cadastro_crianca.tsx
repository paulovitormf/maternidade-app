import React, { useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function Cadastro() {
  const [form, setForm] = useState({
    nome_completo: "",
    cpf: "",
    nascimento: "",
    sexo: "",
    email: "",
    telefone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Dados do cadastro:", form);

    // Aqui você pode enviar para sua API:
    // fetch("/cadastro", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
  };

  return (
    <section className="auth-shell">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <p className="eyebrow">Novo cliente</p>

        <h1>Criar cadastro</h1>

        <p className="lead">
          Seu cadastro permite marcar consultas e acompanhar somente os seus
          horários.
        </p>

        <div className="form-grid">
          <label className="field field-wide">
            <span>Nome completo</span>
            <input
              type="text"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>CPF</span>
            <input
              type="text"
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              maxLength={14}
              required
            />
          </label>

          <label className="field">
            <span>Nascimento</span>
            <input
              type="date"
              name="nascimento"
              value={form.nascimento}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Sexo</span>

            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label className="field">
            <span>E-mail</span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Telefone</span>

            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="button primary" type="submit">
            Cadastrar e entrar
          </button>

          <a className="button ghost" href="/login">
            Já tenho cadastro
          </a>
        </div>
      </form>
    </section>
  );
}