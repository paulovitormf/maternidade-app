import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Clock3,
  Filter,
  Heart,
  MessageCircle,
  Pin,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';

type ForumCategory = {
  name: string;
  description: string;
  discussions: number;
  color: 'pink' | 'blue';
};

type Discussion = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  replies: number;
  likes: number;
  time: string;
  featured?: boolean;
};

const categories: ForumCategory[] = [
  { name: 'Gestação', description: 'Dúvidas e descobertas de cada fase', discussions: 128, color: 'pink' },
  { name: 'Bebês e recém-nascidos', description: 'Os primeiros cuidados e desafios', discussions: 96, color: 'blue' },
  { name: 'Amamentação', description: 'Trocas de experiências e apoio', discussions: 74, color: 'pink' },
  { name: 'Pós-parto e bem-estar', description: 'Cuidar de si também importa', discussions: 52, color: 'blue' },
];

const initialDiscussions: Discussion[] = [
  {
    id: 1,
    title: 'Como vocês estão se preparando para a chegada do bebê?',
    excerpt: 'Estou entrando no terceiro trimestre e queria trocar ideias sobre o que realmente vale a pena deixar pronto.',
    author: 'Mariana S.',
    category: 'Gestação',
    replies: 32,
    likes: 48,
    time: 'há 2 horas',
    featured: true,
  },
  {
    id: 2,
    title: 'Rotina de sono nos primeiros meses',
    excerpt: 'Meu bebê tem 3 meses e estamos tentando criar uma rotina mais tranquila para as noites.',
    author: 'Camila R.',
    category: 'Bebês e recém-nascidos',
    replies: 18,
    likes: 29,
    time: 'há 4 horas',
  },
  {
    id: 3,
    title: 'Uma conquista na amamentação 🤍',
    excerpt: 'Depois de algumas semanas de adaptação, finalmente encontramos uma posição confortável para nós duas.',
    author: 'Aline P.',
    category: 'Amamentação',
    replies: 24,
    likes: 56,
    time: 'ontem',
  },
  {
    id: 4,
    title: 'Como encontrar tempo para descansar?',
    excerpt: 'Queria ouvir outras mães sobre pequenos momentos de autocuidado que cabem na rotina.',
    author: 'Juliana M.',
    category: 'Pós-parto e bem-estar',
    replies: 11,
    likes: 21,
    time: 'ontem',
  },
];

export default function Foruns() {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [search, setSearch] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0].name);

  const visibleDiscussions = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return [...discussions]
      .filter((discussion) => selectedCategory === 'Todas' || discussion.category === selectedCategory)
      .filter((discussion) =>
        !normalizedSearch
        || `${discussion.title} ${discussion.excerpt} ${discussion.category}`.toLocaleLowerCase().includes(normalizedSearch),
      )
      .sort((a, b) => activeTab === 'popular' ? b.likes - a.likes : b.id - a.id);
  }, [activeTab, discussions, search, selectedCategory]);

  const createDiscussion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setDiscussions((current) => [{
      id: Date.now(),
      title,
      excerpt: 'Esta é uma nova conversa da comunidade. Compartilhe sua experiência e acolha outras mães.',
      author: 'Você',
      category: newCategory,
      replies: 0,
      likes: 0,
      time: 'agora',
    }, ...current]);
    setNewTitle('');
    setIsComposerOpen(false);
    setActiveTab('recent');
    setSelectedCategory('Todas');
  };

  return (
    <section className="forums-page">
      <header className="forums-header">
        <div>
          <p className="eyebrow">Comunidade Maternidade</p>
          <h1 className="display-title">Fóruns para trocar, acolher e aprender</h1>
          <p className="page-subtitle">Encontre conversas de quem está vivendo fases parecidas com a sua.</p>
        </div>
        <button className="forum-new-button" type="button" onClick={() => setIsComposerOpen((open) => !open)}>
          <Plus size={18} /> Nova discussão
        </button>
      </header>

      {isComposerOpen && (
        <form className="forum-composer" onSubmit={createDiscussion}>
          <div>
            <p className="eyebrow">Comece uma conversa</p>
            <h2 className="section-title">O que você gostaria de compartilhar?</h2>
          </div>
          <input
            className="field-control"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Ex.: Alguma dica para organizar a mala da maternidade?"
            aria-label="Título da discussão"
            autoFocus
          />
          <div className="forum-composer-actions">
            <select className="field-control" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} aria-label="Categoria da discussão">
              {categories.map((category) => <option key={category.name}>{category.name}</option>)}
            </select>
            <button className="primary-button !w-auto" type="submit">Publicar discussão</button>
          </div>
        </form>
      )}

      <div className="forums-layout">
        <main className="forums-main">
          <div className="forums-toolbar">
            <div className="forum-tabs" role="tablist" aria-label="Ordenar discussões">
              <button className={activeTab === 'popular' ? 'forum-tab active' : 'forum-tab'} type="button" onClick={() => setActiveTab('popular')} role="tab" aria-selected={activeTab === 'popular'}>
                <TrendingUp size={16} /> Em alta
              </button>
              <button className={activeTab === 'recent' ? 'forum-tab active' : 'forum-tab'} type="button" onClick={() => setActiveTab('recent')} role="tab" aria-selected={activeTab === 'recent'}>
                <Clock3 size={16} /> Mais recentes
              </button>
            </div>
            <label className="forum-search">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar discussões" aria-label="Buscar discussões" />
            </label>
          </div>

          <div className="forum-results-heading">
            <div><h2 className="section-title">Conversas da comunidade</h2><p>{visibleDiscussions.length} discussões encontradas</p></div>
            <span className="forum-filter-label"><Filter size={15} /> {selectedCategory}</span>
          </div>

          <div className="discussion-list">
            {visibleDiscussions.map((discussion) => (
              <article className={`discussion-card group ${discussion.featured ? 'discussion-featured' : ''}`} key={discussion.id}>
                <div className="discussion-icon"><MessageCircle size={20} /></div>
                <div className="discussion-content">
                  <div className="discussion-meta"><span>{discussion.category}</span>{discussion.featured && <strong><Pin size={13} /> Destaque</strong>}</div>
                  <h3>{discussion.title}</h3>
                  <p>{discussion.excerpt}</p>
                  <div className="discussion-footer"><span>Por <strong>{discussion.author}</strong> · {discussion.time}</span><span className="discussion-stats"><MessageCircle size={14} /> {discussion.replies}<Heart size={14} /> {discussion.likes}</span></div>
                </div>
                <ArrowUpRight className="discussion-arrow" size={18} />
              </article>
            ))}
            {visibleDiscussions.length === 0 && <div className="card empty-state"><Search size={30} /><h2>Nenhuma conversa encontrada</h2><p>Tente buscar outro termo ou escolher outra categoria.</p></div>}
          </div>
        </main>

        <aside className="forums-sidebar">
          <div className="forum-community-card">
            <span className="forum-community-icon"><Users size={20} /></span>
            <strong>Um espaço seguro para você</strong>
            <p>Compartilhe suas dúvidas e experiências com respeito e empatia.</p>
            <span className="forum-members"><span className="member-dots">● ● ●</span> +2.400 mães na comunidade</span>
          </div>
          <div className="forum-categories-card">
            <div className="forum-sidebar-heading"><div><p className="eyebrow">Explore</p><h2 className="section-title">Categorias</h2></div><Filter size={17} /></div>
            <button className={`forum-category ${selectedCategory === 'Todas' ? 'active' : ''}`} type="button" onClick={() => setSelectedCategory('Todas')}><span className="category-dot category-dot-all" /><span><strong>Todas as discussões</strong><small>350 conversas</small></span></button>
            {categories.map((category) => (
              <button className={`forum-category ${selectedCategory === category.name ? 'active' : ''}`} type="button" key={category.name} onClick={() => setSelectedCategory(category.name)}>
                <span className={`category-dot category-dot-${category.color}`} /><span><strong>{category.name}</strong><small>{category.discussions} conversas</small></span>
              </button>
            ))}
          </div>
          <div className="forum-tip"><Heart size={18} fill="currentColor" /><div><strong>Gentileza faz diferença</strong><p>Antes de responder, lembre-se de acolher.</p></div></div>
        </aside>
      </div>
    </section>
  );
}
