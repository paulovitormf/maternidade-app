import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Clock3, Filter, Heart, MessageCircle, Pin, Plus, Search, Send, TrendingUp, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

type Category = { id: number; nome: string; descricao: string; discussoes: number };
type Reply = { id: number; conteudo: string; autor: string; dataCriacao: string };
type Topic = {
  id: number;
  categoriaId: number;
  categoria: string;
  titulo: string;
  conteudo: string;
  autor: string;
  curtidoPeloUsuario: boolean;
  curtidas: number;
  respostas: number;
  fixado: boolean;
  dataCriacao: string;
  ultimasRespostas: Reply[];
};

const fallbackCategories: Category[] = [
  { id: 1, nome: 'Gestação', descricao: 'Dúvidas e descobertas de cada fase', discussoes: 128 },
  { id: 2, nome: 'Bebês e recém-nascidos', descricao: 'Os primeiros cuidados e desafios', discussoes: 96 },
  { id: 3, nome: 'Amamentação', descricao: 'Trocas de experiências e apoio', discussoes: 74 },
  { id: 4, nome: 'Pós-parto e bem-estar', descricao: 'Cuidar de si também importa', discussoes: 52 },
];

export default function Foruns() {
  const { topicId } = useParams();
  return topicId ? <ForumDetail topicId={Number(topicId)} /> : <ForumList />;
}

function ForumList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'popular' | 'recent'>('popular');
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number>(fallbackCategories[0].id);
  const [publishError, setPublishError] = useState('');

  useEffect(() => {
    api.get<Category[]>('/forum/categorias').then(({ data }) => {
      setCategories(data);
      setCategoryId(data[0]?.id ?? categoryId);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      api.get<Topic[]>('/forum/topicos', { params: { categoriaId: selectedCategory, busca: search.trim() || undefined } })
        .then(({ data }) => setTopics(data))
        .catch(() => setTopics([]));
    }, 150);
    return () => window.clearTimeout(timer);
  }, [selectedCategory, search]);

  const visibleTopics = useMemo(() => [...topics].sort((a, b) =>
    tab === 'popular' ? b.curtidas - a.curtidas : b.id - a.id,
  ), [tab, topics]);

  const createTopic = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPublishError('');
    api.post<Topic>('/forum/topicos', { categoriaId: categoryId, titulo: title.trim(), conteudo: content.trim() })
      .then(({ data }) => {
        setTopics((current) => [data, ...current]);
        setTitle('');
        setContent('');
        setComposerOpen(false);
      }).catch((error: unknown) => {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ERR_NETWORK') {
          setPublishError('O servidor não está acessível. Inicie o backend em http://localhost:8080.');
          return;
        }
        setPublishError('Não foi possível publicar a discussão. Tente novamente.');
      });
  };

  const toggleLike = (topicId: number) => {
    api.put<{ curtidas: number; curtido: boolean }>(`/forum/topicos/${topicId}/curtir`)
      .then(({ data }) => {
        setTopics((current) => current.map((topic) =>
          topic.id === topicId
            ? { ...topic, curtidas: data.curtidas, curtidoPeloUsuario: data.curtido }
            : topic,
        ));
      })
      .catch(() => undefined);
  };

  return (
    <section className="forums-page">
      <header className="forums-header">
        <div><p className="eyebrow">Comunidade Maternidade</p><h1 className="display-title">Fóruns para trocar, acolher e aprender</h1><p className="page-subtitle">Encontre conversas de quem está vivendo fases parecidas com a sua.</p></div>
        <button className="forum-new-button" type="button" onClick={() => setComposerOpen((open) => !open)}><Plus size={18} /> Nova discussão</button>
      </header>

      {composerOpen && (
        <form className="forum-composer" onSubmit={createTopic}>
          <div><p className="eyebrow">Comece uma conversa</p><h2 className="section-title">O que você gostaria de compartilhar?</h2></div>
          {publishError && <div className="alert-error" role="alert">{publishError}</div>}
          <input className="field-control" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título da discussão" aria-label="Título da discussão" autoFocus />
          <textarea className="field-control min-h-28 resize-y" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Escreva sua dúvida ou experiência..." aria-label="Conteúdo da discussão" />
          <div className="forum-composer-actions">
            <select className="field-control" value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))} aria-label="Categoria da discussão">
              {categories.map((category) => <option value={category.id} key={category.id}>{category.nome}</option>)}
            </select>
            <button className="primary-button !w-auto" type="submit">Publicar discussão</button>
          </div>
        </form>
      )}

      <div className="forums-layout">
        <main className="forums-main">
          <div className="forums-toolbar">
            <div className="forum-tabs" role="tablist">
              <button className={`forum-tab ${tab === 'popular' ? 'active' : ''}`} type="button" onClick={() => setTab('popular')}><TrendingUp size={16} /> Em alta</button>
              <button className={`forum-tab ${tab === 'recent' ? 'active' : ''}`} type="button" onClick={() => setTab('recent')}><Clock3 size={16} /> Mais recentes</button>
            </div>
            <label className="forum-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar discussões" /></label>
          </div>
          <div className="forum-results-heading"><div><h2 className="section-title">Conversas da comunidade</h2><p>{visibleTopics.length} discussões encontradas</p></div></div>
          <div className="discussion-list">
            {visibleTopics.map((topic) => (
              <article
                className={`discussion-card group cursor-pointer ${topic.fixado ? 'discussion-featured' : ''}`}
                key={topic.id}
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/foruns/${topic.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/foruns/${topic.id}`);
                  }
                }}
              >
                <div className="discussion-icon"><MessageCircle size={20} /></div>
                <div className="discussion-content">
                  <div className="discussion-meta"><span>{topic.categoria}</span>{topic.fixado && <strong><Pin size={13} /> Destaque</strong>}</div>
                  <h3>{topic.titulo}</h3>
                  <p>{topic.conteudo}</p>
                  <div className="discussion-footer">
                    <span>Por <strong>{topic.autor}</strong> · {formatTime(topic.dataCriacao)}</span>
                    <span className="discussion-stats">
                      <MessageCircle size={14} /> {topic.respostas}
                      <button
                        className={`discussion-like ${topic.curtidoPeloUsuario ? 'liked' : ''}`}
                        type="button"
                        aria-label={topic.curtidoPeloUsuario ? 'Descurtir discussão' : 'Curtir discussão'}
                        aria-pressed={topic.curtidoPeloUsuario}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleLike(topic.id);
                        }}
                      >
                        <Heart size={14} fill={topic.curtidoPeloUsuario ? 'currentColor' : 'none'} /> {topic.curtidas}
                      </button>
                    </span>
                  </div>
                </div>
                <Link className="discussion-arrow" to={`/foruns/${topic.id}`} aria-label={`Entrar em ${topic.titulo}`}><ArrowUpRight size={18} /></Link>
              </article>
            ))}
            {visibleTopics.length === 0 && <div className="card empty-state"><MessageCircle size={30} /><h2>Nenhuma conversa encontrada</h2><p>Seja a primeira pessoa a iniciar uma discussão.</p></div>}
          </div>
        </main>
        <aside className="forums-sidebar">
          <div className="forum-community-card"><span className="forum-community-icon"><Users size={20} /></span><strong>Um espaço seguro para você</strong><p>Compartilhe suas dúvidas e experiências com respeito e empatia.</p></div>
          <div className="forum-categories-card">
            <div className="forum-sidebar-heading"><div><p className="eyebrow">Explore</p><h2 className="section-title">Categorias</h2></div><Filter size={17} /></div>
            <button className={`forum-category ${selectedCategory === undefined ? 'active' : ''}`} type="button" onClick={() => setSelectedCategory(undefined)}><span className="category-dot category-dot-all" /><span><strong>Todas as discussões</strong></span></button>
            {categories.map((category) => (
              <button className={`forum-category ${selectedCategory === category.id ? 'active' : ''}`} type="button" key={category.id} onClick={() => setSelectedCategory(category.id)}>
                <span className="category-dot category-dot-pink" /><span><strong>{category.nome}</strong><small>{category.discussoes} conversas</small></span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ForumDetail({ topicId }: { topicId: number }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    api.get<Topic>(`/forum/topicos/${topicId}`).then(({ data }) => setTopic(data)).catch(() => setTopic(null));
    api.get<Reply[]>(`/forum/topicos/${topicId}/respostas`).then(({ data }) => setReplies(data)).catch(() => setReplies([]));
  }, [topicId]);

  const toggleLike = () => {
    api.put<{ curtidas: number; curtido: boolean }>(`/forum/topicos/${topicId}/curtir`)
      .then(({ data }) => setTopic((current) => current ? { ...current, curtidas: data.curtidas, curtidoPeloUsuario: data.curtido } : current))
      .catch(() => undefined);
  };

  const submitReply = (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim()) return;
    api.post<Reply>(`/forum/topicos/${topicId}/respostas`, { conteudo: answer.trim() })
      .then(({ data }) => {
        setReplies((current) => [...current, data]);
        setAnswer('');
        setTopic((current) => current ? { ...current, respostas: current.respostas + 1 } : current);
      }).catch(() => undefined);
  };

  if (!topic) return <section className="card empty-state"><MessageCircle size={30} /><h2>Discussão não encontrada</h2><Link className="secondary-button" to="/foruns">Voltar aos fóruns</Link></section>;

  return (
    <section className="forum-detail">
      <Link className="forum-back-button" to="/foruns"><ArrowLeft size={17} /> Voltar às discussões</Link>
      <article className="forum-detail-topic card">
        <div className="discussion-meta"><span>{topic.categoria}</span>{topic.fixado && <strong><Pin size={13} /> Destaque</strong>}</div>
        <h1 className="display-title !text-3xl">{topic.titulo}</h1>
        <p className="forum-detail-content">{topic.conteudo}</p>
        <div className="discussion-footer"><span>Por <strong>{topic.autor}</strong> · {formatTime(topic.dataCriacao)}</span><button className={`forum-like-button ${topic.curtidoPeloUsuario ? 'liked' : ''}`} type="button" onClick={toggleLike} aria-pressed={topic.curtidoPeloUsuario}><Heart size={17} fill={topic.curtidoPeloUsuario ? 'currentColor' : 'none'} /> {topic.curtidas} curtidas</button></div>
      </article>
      <section className="forum-replies card">
        <h2 className="section-title">Participação <span>{topic.respostas}</span></h2>
        {replies.map((reply) => <article className="forum-reply" key={reply.id}><div className="forum-reply-avatar">{reply.autor.slice(0, 1).toUpperCase()}</div><div><div className="forum-reply-heading"><strong>{reply.autor}</strong><time>{formatTime(reply.dataCriacao)}</time></div><p>{reply.conteudo}</p></div></article>)}
        {replies.length === 0 && <p className="forum-no-replies">Ainda não há respostas. Seja a primeira pessoa a participar.</p>}
        <form className="forum-answer" onSubmit={submitReply}><textarea className="field-control min-h-28 resize-y" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Escreva uma resposta acolhedora..." aria-label="Sua resposta" /><button className="primary-button !w-auto" type="submit"><Send size={16} /> Participar</button></form>
      </section>
    </section>
  );
}

function formatTime(value: unknown) {
  const date = parseForumDate(value);
  if (!date) return 'recentemente';
  const elapsedMilliseconds = Date.now() - date.getTime();
  if (elapsedMilliseconds < -60000) return 'recentemente';
  const minutes = Math.max(0, Math.floor(elapsedMilliseconds / 60000));
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  if (minutes < 1440) return `há ${Math.floor(minutes / 60)} h`;
  const days = Math.floor(minutes / 1440);
  return days === 1 ? 'ontem' : `há ${days} dias`;
}

function parseForumDate(value: unknown): Date | null {
  if (!value) return null;

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value as unknown as number[];
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day, hour, minute, second);
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== 'string') return null;

  const isoLike = /^\d{4}-\d{2}-\d{2}T/.test(value);
  const date = new Date(isoLike || value.endsWith('Z') ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
