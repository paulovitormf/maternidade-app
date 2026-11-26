import axios from 'axios';
import { CheckCircle2, Heart } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { reenviarVerificacaoEmail, verificarEmail } from '../services/usuarioService';

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const emailInicial = searchParams.get('email') ?? '';
  const codigoInicial = searchParams.get('codigo') ?? '';
  const [email, setEmail] = useState(emailInicial);
  const [codigo, setCodigo] = useState(codigoInicial);
  const [verificado, setVerificado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const linkProcessado = useRef(false);

  useEffect(() => {
    if (linkProcessado.current || !emailInicial || !/^\d{8}$/.test(codigoInicial)) return;
    linkProcessado.current = true;
    setCarregando(true);
    verificarEmail({ email: emailInicial, codigo: codigoInicial })
      .then(() => setVerificado(true))
      .catch((error: unknown) => setErro(obterMensagemErro(error, 'O link é inválido ou expirou.')))
      .finally(() => setCarregando(false));
  }, [codigoInicial, emailInicial]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    setMensagem('');
    setCarregando(true);
    try {
      await verificarEmail({ email, codigo });
      setVerificado(true);
    } catch (error) {
      setErro(obterMensagemErro(error, 'Não foi possível verificar o código. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  };

  const reenviar = async () => {
    setErro('');
    setMensagem('');
    setReenviando(true);
    try {
      const resposta = await reenviarVerificacaoEmail(email);
      setMensagem(resposta.mensagem);
    } catch (error) {
      setErro(obterMensagemErro(error, 'Não foi possível enviar o código. Tente novamente.'));
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <p className="mb-12 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FADCE1]">
          <Heart size={29} strokeWidth={1.6} fill="currentColor" />
        </p>
        <p className="eyebrow !text-[#FADCE1]">Quase lá</p>
        <h1 className="font-display text-5xl font-bold leading-tight">Confirme seu e-mail com segurança.</h1>
        <p className="mt-5 max-w-sm text-base leading-7 text-white/80">
          Enviamos um código para sua caixa de entrada. Você também pode confirmar pelo link recebido.
        </p>
      </section>
      <section className="auth-card">
        {verificado ? (
          <div className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto text-emerald-600" size={44} aria-hidden="true" />
            <div>
              <p className="eyebrow">Tudo pronto</p>
              <h1 className="display-title !text-3xl">E-mail confirmado!</h1>
              <p className="page-subtitle">Agora você já pode entrar na sua conta.</p>
            </div>
            <Link className="primary-button" to="/login">Ir para o login</Link>
          </div>
        ) : (
          <>
            <p className="eyebrow">Verificação de e-mail</p>
            <h1 className="display-title !text-3xl">Confira sua caixa de entrada</h1>
            <p className="page-subtitle mb-7">
              Digite o código de 8 dígitos enviado para o seu e-mail. Ele expira em 15 minutos.
            </p>
            <form onSubmit={submit} className="space-y-5">
              <label className="field">
                <span className="field-label">E-mail</span>
                <input
                  className="field-control"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="field">
                <span className="field-label">Código de verificação</span>
                <input
                  className="field-control text-center text-xl font-bold tracking-[0.35em]"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  required
                  placeholder="00000000"
                  value={codigo}
                  onChange={(event) => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 8))}
                />
              </label>
              {erro && <p className="alert-error" role="alert">{erro}</p>}
              {mensagem && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">{mensagem}</p>}
              <button className="primary-button" disabled={carregando}>
                {carregando ? 'Verificando...' : 'Confirmar e-mail'}
              </button>
            </form>
            <button
              className="mt-4 w-full text-sm font-bold text-[#3B7280] hover:underline disabled:opacity-60"
              type="button"
              disabled={reenviando || !email.trim()}
              onClick={reenviar}
            >
              {reenviando ? 'Enviando...' : 'Reenviar código'}
            </button>
            <p className="mt-5 text-center text-sm text-slate-500">
              <Link className="font-bold text-[#B0435B] hover:underline" to="/login">Voltar para o login</Link>
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function obterMensagemErro(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const resposta = error.response?.data;
    const mensagem = typeof resposta === 'string'
      ? resposta
      : resposta && typeof resposta.mensagem === 'string'
        ? resposta.mensagem
        : resposta && typeof resposta.message === 'string'
          ? resposta.message
          : null;
    return mensagem || fallback;
  }
  return fallback;
}
