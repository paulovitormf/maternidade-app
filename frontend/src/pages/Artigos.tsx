import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock3,
  Heart,
  Mail,
  Search,
  Sparkles,
} from 'lucide-react';

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  accent: 'pink' | 'blue' | 'cream' | 'sage';
  author: string;
  date: string;
  featured?: boolean;
};

const articles: Article[] = [
  {
    id: 1,
    category: 'Bem-estar',
    title: 'Como cuidar de si nos primeiros meses',
    excerpt: 'Descanso, limites e pequenas pausas podem fazer diferença em uma fase cheia de novas responsabilidades.',
    readTime: '6 min',
    accent: 'pink',
    author: 'Equipe Maternidade',
    date: '18 nov',
  },
  {
    id: 2,
    category: 'Amamentação',
    title: 'Amamentar sem pressões: encontre o seu ritmo',
    excerpt: 'Sinais de fome, conforto e momentos em que buscar ajuda profissional.',
    readTime: '8 min',
    accent: 'blue',
    author: 'Dra. Helena Costa',
    date: '14 nov',
  },
  {
    id: 3,
    category: 'Desenvolvimento',
    title: 'Marcos do bebê: observar sem comparar',
    excerpt: 'Conheça o caminho único de cada criança e saiba quando conversar com o pediatra.',
    readTime: '5 min',
    accent: 'cream',
    author: 'Equipe Maternidade',
    date: '10 nov',
  },
  {
    id: 4,
    category: 'Gestação',
    title: 'Preparando um espaço emocional para o parto',
    excerpt: 'Informação, apoio e escolhas conscientes para viver o nascimento com mais tranquilidade.',
    readTime: '7 min',
    accent: 'pink',
    author: 'Dra. Marina Alves',
    date: '6 nov',
  },
  {
    id: 5,
    category: 'Sono',
    title: 'Criação de rotina: onde começar?',
    excerpt: 'Uma rotina de sono pode ser construída aos poucos, sem perfeccionismo nem culpa.',
    readTime: '4 min',
    accent: 'sage',
    author: 'Equipe Maternidade',
    date: '2 nov',
  },
  {
    id: 6,
    category: 'Parentalidade',
    title: 'Como pedir ajuda sem se sentir sobrecarregada',
    excerpt: 'Cuidar de uma família é um trabalho coletivo. Frases práticas para dividir responsabilidades.',
    readTime: '6 min',
    accent: 'blue',
    author: 'Ana Paula Ribeiro',
    date: '28 out',
  },
];

const books = [
  { title: 'O Bebê é Meu', author: 'Penelope Leach', cover: '/images/livros/o-bebe-e-meu.svg', tag: 'Primeiros cuidados' },
  { title: 'Mães que se Cuidam', author: 'Clara Monteiro', cover: '/images/livros/maes-que-se-cuidam.svg', tag: 'Bem-estar' },
  { title: 'Família Feliz', author: 'Fábio e Alexandra', cover: '/images/livros/familia-feliz.svg', tag: 'Relacionamentos' },
  { title: 'Cada Criança, um Mundo', author: 'Julia R. Santos', cover: '/images/livros/cada-crianca.svg', tag: 'Desenvolvimento' },
];

export default function Artigos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['Todos', ...Array.from(new Set(articles.map((article) => article.category)))];
  const visibleArticles = useMemo(() => articles.filter((article) => {
    const matchesCategory = category === 'Todos' || article.category === category;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [category, search]);

  const subscribe = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <section className="articles-page">
      <header className="articles-header">
        <div>
          <p className="eyebrow">Conteúdo confiável e acolhedor</p>
          <h1 className="display-title">Artigos & leituras para mães</h1>
        </div>
        <label className="articles-search">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por tema" aria-label="Buscar artigos" />
        </label>
      </header>

      <article className="article-featured">
        <div className="article-featured-copy">
          <span className="article-featured-label"><Sparkles size={15} /> Seleção da semana</span>
          <div className="featured-category featured-category-pink"><span /> Bem-estar</div>
          <h2>Uma nova rotina começa aos poucos</h2>
          <p>Nos primeiros dias com o bebê, viver um passo de cada vez pode ser mais importante do que dar conta de tudo.</p>
          <div className="article-featured-meta">
            <span><Clock3 size={14} /> 7 min de leitura</span>
            <span>Por Dra. Marina Alves</span>
          </div>
          <button type="button" className="article-read-button">Ler artigo <ArrowUpRight size={17} /></button>
        </div>
        <div className="article-featured-art" aria-label="Ilustração acolhedora de mãe e bebê">
          <div className="featured-quote">
            <span>COMEÇO,</span>
            <strong>sempre<br />recomeço.</strong>
            <Heart size={20} fill="currentColor" />
          </div>
          <span className="featured-orb featured-orb-one" />
          <span className="featured-orb featured-orb-two" />
        </div>
      </article>

      <div className="articles-layout">
        <main className="articles-main">
          <div className="articles-toolbar">
            <div><p className="eyebrow">Mais recentes</p><h2 className="section-title">Artigos para você</h2></div>
            <div className="article-filters" aria-label="Filtrar artigos por categoria">
              {categories.map((item) => (
                <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="article-grid">
            {visibleArticles.map((article) => (
              <article className="article-card" key={article.id}>
                <div className={`article-card-art article-card-art-${article.accent}`}>
                  <span className="article-card-bookmark" aria-hidden="true"><Bookmark size={17} /></span>
                  <div className="article-art-orbit" aria-hidden="true"><Heart size={30} fill="currentColor" /></div>
                </div>
                <div className="article-card-body">
                  <div className="article-card-meta">
                    <span className={`article-card-category article-category-${article.accent}`}><i />{article.category}</span>
                    <span><Clock3 size={13} /> {article.readTime}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-card-footer">
                    <span>Por {article.author}</span>
                    <button type="button" className="article-card-link" aria-label={`Ler ${article.title}`}>Ler <ArrowUpRight size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visibleArticles.length === 0 && (
            <div className="card empty-state"><Search size={30} /><h2>Nenhum artigo encontrado</h2><p>Tente outro termo ou escolha outra categoria.</p></div>
          )}
        </main>

        <aside className="articles-sidebar">
          <section className="books-card">
            <div className="books-heading">
              <div><p className="eyebrow">Nossa curadoria</p><h2 className="section-title">Para sua estante</h2></div>
              <BookOpen size={21} />
            </div>
            <div className="book-list">
              {books.map((book) => (
                <article className="book-item" key={book.title}>
                  <img className="book-cover" src={book.cover} alt={`Capa do livro ${book.title}`} loading="lazy" />
                  <div><span className="book-tag">{book.tag}</span><h3>{book.title}</h3><p>{book.author}</p></div>
                  <button type="button" aria-label={`Ver ${book.title}`}><ArrowUpRight size={16} /></button>
                </article>
              ))}
            </div>
            <button type="button" className="all-books-button">Ver todos os livros <ArrowRight size={16} /></button>
          </section>

          <div className="sidebar-image-slot" aria-label="Espaço reservado para imagem">
            {/* Substitua este bloco pela imagem da seção no futuro. */}
          </div>
        </aside>
      </div>

      <section className="newsletter-card">
        <div className="newsletter-icon"><Mail size={23} /></div>
        <div className="newsletter-copy"><p className="eyebrow">Leitura para desacelerar</p><h2>Receba novos conteúdos toda semana</h2><p>Uma seleção cuidadosa direto no seu e-mail.</p></div>
        {subscribed ? (
          <p className="newsletter-success" role="status"><CheckCircle2 size={19} /> Você está na nossa lista!</p>
        ) : (
          <form className="newsletter-form" onSubmit={subscribe}>
            <label><span className="sr-only">Seu e-mail</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Seu melhor e-mail" /></label>
            <button type="submit">Quero receber <ArrowRight size={16} /></button>
          </form>
        )}
      </section>

      <footer className="reading-disclaimer"><Heart size={16} fill="currentColor" /><p><strong>Importante:</strong> os conteúdos informativos não substituem acompanhamento médico ou profissional.</p></footer>
    </section>
  );
}
