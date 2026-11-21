import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Clock3, Heart, Search, Sparkles } from 'lucide-react';

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  accent: 'pink' | 'blue' | 'cream';
};

const articles: Article[] = [
  {
    id: 1,
    category: 'Bem-estar',
    title: 'Como cuidar de si nos primeiros meses',
    excerpt: 'Descanso, limites e pequenas pausas podem fazer diferença em uma fase cheia de novas responsabilidades.',
    readTime: '6 min',
    accent: 'pink',
  },
  {
    id: 2,
    category: 'Amamentação',
    title: 'Amamentar sem pressões: encontre o seu ritmo',
    excerpt: 'Informações acolhedoras para entender sinais de fome, conforto e momentos em que buscar ajuda profissional.',
    readTime: '8 min',
    accent: 'blue',
  },
  {
    id: 3,
    category: 'Desenvolvimento',
    title: 'Marcos do bebê: observação sem comparação',
    excerpt: 'Entenda o desenvolvimento infantil como um caminho único e reconheça sinais para conversar com o pediatra.',
    readTime: '5 min',
    accent: 'cream',
  },
  {
    id: 4,
    category: 'Gestação',
    title: 'Preparando um espaço emocional para o parto',
    excerpt: 'Informação, apoio e escolhas conscientes ajudam a viver o nascimento com mais tranquilidade.',
    readTime: '7 min',
    accent: 'pink',
  },
];

const books = [
  { title: 'O bebê é meu', author: 'Penelope Leach', tone: 'rose' },
  { title: 'Mães que se cuidam', author: 'Leitura recomendada', tone: 'sage' },
  { title: 'Família feliz', author: 'Fábio & Alexandra', tone: 'blue' },
];

export default function Artigos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(articles.map((article) => article.category)))];
  const visibleArticles = useMemo(() => articles.filter((article) => {
    const matchesCategory = category === 'Todos' || article.category === category;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [category, search]);

  return (
    <section className="articles-page">
      <header className="articles-header">
        <div>
          <p className="eyebrow">Conteúdo para sua jornada</p>
          <h1 className="display-title">Artigos & leituras para mães</h1>
          <p className="page-subtitle">Encontre informações acolhedoras, práticas e sugestões de livros para viver cada fase com mais confiança.</p>
        </div>
        <label className="articles-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar artigos"
            aria-label="Buscar artigos"
          />
        </label>
      </header>

      <article className="article-featured">
        <div className="article-featured-copy">
          <span className="article-featured-label"><Sparkles size={15} /> Leitura em destaque</span>
          <p className="article-featured-category">Pós-parto e bem-estar</p>
          <h2>Uma nova rotina começa aos poucos</h2>
          <p>Nos primeiros dias com o bebê, viver um passo de cada vez pode ser mais importante do que dar conta de tudo.</p>
          <button type="button" className="article-read-button">Ler artigo <ArrowUpRight size={17} /></button>
        </div>
        <div className="article-featured-art" aria-hidden="true">
          <span className="featured-sun" />
          <div className="featured-moon"><Heart size={42} fill="currentColor" /></div>
          <span className="featured-leaf featured-leaf-one" />
          <span className="featured-leaf featured-leaf-two" />
        </div>
      </article>

      <div className="articles-layout">
        <main className="articles-main">
          <div className="articles-toolbar">
            <div>
              <p className="eyebrow">Descubra mais</p>
              <h2 className="section-title">Artigos recentes</h2>
            </div>
            <div className="article-filters" aria-label="Filtrar artigos por categoria">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? 'active' : ''}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="article-grid">
            {visibleArticles.map((article) => (
              <article className="article-card" key={article.id}>
                <div className={`article-card-art article-card-art-${article.accent}`} aria-hidden="true">
                  <span><BookOpen size={28} /></span>
                </div>
                <div className="article-card-body">
                  <div className="article-card-meta">
                    <span>{article.category}</span>
                    <span><Clock3 size={13} /> {article.readTime}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <button type="button" className="article-card-link">Continuar lendo <ArrowUpRight size={16} /></button>
                </div>
              </article>
            ))}
          </div>

          {visibleArticles.length === 0 && (
            <div className="card empty-state">
              <Search size={30} />
              <h2>Nenhum artigo encontrado</h2>
              <p>Tente outro termo ou escolha outra categoria.</p>
            </div>
          )}
        </main>

        <aside className="books-sidebar">
          <div className="books-card">
            <div className="books-heading">
              <div>
                <p className="eyebrow">Para a estante</p>
                <h2 className="section-title">Livros sugeridos</h2>
              </div>
              <BookOpen size={20} />
            </div>
            <div className="book-list">
              {books.map((book) => (
                <article className="book-item" key={book.title}>
                  <div className={`book-cover book-cover-${book.tone}`} aria-hidden="true">
                    <span>M</span>
                  </div>
                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="reading-note">
            <Heart size={18} fill="currentColor" />
            <p><strong>Um cuidado importante</strong><span>As informações aqui não substituem orientação médica ou profissional.</span></p>
          </div>
        </aside>
      </div>
    </section>
  );
}
