
import { useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Clock3, Search } from 'lucide-react';

type Article = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
};

const articles: Article[] = [
  {
    id: 1,
    category: 'Bem-estar',
    title: 'Como cuidar de si nos primeiros meses',
    excerpt: 'Descanso, limites e pequenas pausas podem fazer diferença em uma fase cheia de novas responsabilidades.',
    readTime: '6 min',
    image: '/images/artigos/bem-estar.jpg',
  },
  {
    id: 2,
    category: 'Amamentação',
    title: 'Amamentar sem pressões: encontre o seu ritmo',
    excerpt: 'Informações acolhedoras para entender sinais de fome, conforto e momentos em que buscar ajuda profissional.',
    readTime: '8 min',
    image: '/images/artigos/amamentacao.jpg',
  },
  {
    id: 3,
    category: 'Desenvolvimento',
    title: 'Marcos do bebê: observação sem comparação',
    excerpt: 'Entenda o desenvolvimento infantil como um caminho único e reconheça sinais para conversar com o pediatra.',
    readTime: '5 min',
    image: '/images/artigos/desenvolvimento.jpg',
  },
  {
    id: 4,
    category: 'Gestação',
    title: 'Preparando um espaço emocional para o parto',
    excerpt: 'Informação, apoio e escolhas conscientes ajudam a viver o nascimento com mais tranquilidade.',
    readTime: '7 min',
    image: '/images/artigos/gestacao.jpg',
  },
];

const books = [
  {
    title: 'O bebê é meu',
    author: 'Penelope Leach',
    cover: '/images/livros/bebe-e-meu.jpg',
  },
  {
    title: 'Mães que se cuidam',
    author: 'Leitura recomendada',
    cover: '/images/livros/maes-que-se-cuidam.jpg',
  },
  {
    title: 'Família feliz',
    author: 'Fábio & Alexandra',
    cover: '/images/livros/familia-feliz.jpg',
  },
];

export default function Artigos() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = [
    'Todos',
    ...Array.from(new Set(articles.map((article) => article.category))),
  ];

  const visibleArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        category === 'Todos' || article.category === category;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        `${article.title} ${article.excerpt} ${article.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <section className="articles-page">

      <header className="articles-header">
        <div>
          <p className="eyebrow">Biblioteca materna</p>
          <h1 className="display-title">Artigos e leituras</h1>
          <p className="page-subtitle">
            Um espaço para descobrir, aprender e encontrar informações
            para cada fase da maternidade.
          </p>
        </div>

        <label className="articles-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar artigos..."
            aria-label="Buscar artigos"
          />
        </label>
      </header>

      <div className="articles-layout">

        <main className="articles-main">

          <div className="articles-toolbar">
            <div>
              <p className="eyebrow">Conteúdos</p>
              <h2 className="section-title">Explore os artigos</h2>
            </div>

            <div
              className="article-filters"
              aria-label="Filtrar artigos por categoria"
            >
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

                <div className="article-card-image">
                  <img
                    src={article.image}
                    alt=""
                    loading="lazy"
                  />
                </div>

                <div className="article-card-body">

                  <div className="article-card-meta">
                    <span>{article.category}</span>

                    <span>
                      <Clock3 size={13} />
                      {article.readTime}
                    </span>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.excerpt}</p>

                  <button
                    type="button"
                    className="article-card-link"
                  >
                    Continuar lendo
                    <ArrowUpRight size={16} />
                  </button>

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
                <p className="eyebrow">Boas leituras</p>
                <h2 className="section-title">Livros sugeridos</h2>
              </div>

              <BookOpen size={20} />
            </div>

            <div className="book-list">
              {books.map((book) => (
                <article className="book-item" key={book.title}>

                  <div className="book-cover">
                    <img
                      src={book.cover}
                      alt={`Capa do livro ${book.title}`}
                      loading="lazy"
                    />
                  </div>

                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>

                </article>
              ))}
            </div>

          </div>

          <div className="reading-note">
            <p>
              <strong>Um cuidado importante</strong>
              <span>
                As informações aqui não substituem orientação médica
                ou profissional.
              </span>
            </p>
          </div>

        </aside>

      </div>
    </section>
  );
}
