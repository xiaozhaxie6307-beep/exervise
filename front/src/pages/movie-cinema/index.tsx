import './movie-cinema.css';

import { useState } from 'react';

type MovieItem = {
  title: string;
  year: string;
  genre: string;
  duration: string;
  rating: string;
  summary: string;
  tag: string;
};

const categories = ['All', 'Sci-Fi', 'Thriller', 'Drama', 'Animation'];

const movies: MovieItem[] = [
  {
    title: 'Orbit City',
    year: '2026',
    genre: 'Sci-Fi',
    duration: '2h 11m',
    rating: '9.1',
    tag: 'Now Streaming',
    summary: 'A renegade pilot returns to a floating metropolis to stop an AI blackout.',
  },
  {
    title: 'Silent District',
    year: '2025',
    genre: 'Thriller',
    duration: '1h 54m',
    rating: '8.7',
    tag: 'Top Pick',
    summary: 'A sound designer uncovers a pattern of disappearances buried in city noise.',
  },
  {
    title: 'Blue Evening',
    year: '2024',
    genre: 'Drama',
    duration: '2h 03m',
    rating: '8.5',
    tag: 'Editors Choice',
    summary: 'Three siblings reunite at a seaside cinema and confront a long-hidden letter.',
  },
  {
    title: 'Pixel Run',
    year: '2026',
    genre: 'Animation',
    duration: '1h 39m',
    rating: '8.9',
    tag: 'Family Favorite',
    summary: 'A game character escapes into the real world to save her fading digital universe.',
  },
];

function MovieCinema() {
  const [activeCategory, setActiveCategory] = useState('All');

  const visibleMovies =
    activeCategory === 'All'
      ? movies
      : movies.filter((movie) => movie.genre === activeCategory);

  return (
    <main className="movie-cinema-page">
      <section className="movie-hero-section">
        <div className="movie-hero-copy">
          <span className="movie-hero-label">Cinema Demo</span>
          <h1>MoonFrame 电影世界</h1>
          <p>
            一个基于当前 React 项目搭建的电影网站示例页，包含推荐影片、分类筛选、
            榜单信息和沉浸式视觉风格，适合你后续继续扩展成真实业务页面。
          </p>
          <div className="movie-hero-actions">
            <a className="movie-primary-link" href="#movie-grid">
              浏览影片
            </a>
            <a className="movie-secondary-link" href="#movie-highlight">
              本周精选
            </a>
          </div>
        </div>

        <aside className="movie-hero-panel">
          <div className="movie-hero-panel-top">
            <span>Featured Premiere</span>
            <strong>Orbit City</strong>
          </div>
          <ul className="movie-stat-list">
            <li>
              <span className="movie-stat-label">IMDb</span>
              <strong>9.1</strong>
            </li>
            <li>
              <span className="movie-stat-label">Genre</span>
              <strong>Sci-Fi</strong>
            </li>
            <li>
              <span className="movie-stat-label">Length</span>
              <strong>2h 11m</strong>
            </li>
          </ul>
        </aside>
      </section>

      <section className="movie-highlight-section" id="movie-highlight">
        <div className="movie-section-heading">
          <span>Spotlight</span>
          <h2>本周值得首刷的未来电影</h2>
        </div>

        <div className="movie-highlight-card">
          <div className="movie-highlight-poster" />
          <div className="movie-highlight-content">
            <span className="movie-highlight-badge">Limited Release</span>
            <h3>Orbit City</h3>
            <p>
              在失重城市与失控算法之间，一场关于记忆、能源与人类选择权的追逐战正式展开。
              这个示例区块展示了电影网站常见的主打影片版式。
            </p>
            <div className="movie-highlight-meta">
              <span>2026</span>
              <span>Sci-Fi Epic</span>
              <span>Director: Lena Cross</span>
            </div>
          </div>
        </div>
      </section>

      <section className="movie-library-section" id="movie-grid">
        <div className="movie-library-head">
          <div className="movie-section-heading">
            <span>Library</span>
            <h2>精选片库</h2>
          </div>

          <div className="movie-category-bar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? 'movie-category-button movie-category-button-active'
                    : 'movie-category-button'
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="movie-grid">
          {visibleMovies.map((movie) => (
            <article className="movie-card" key={movie.title}>
              <div className="movie-card-cover">
                <span>{movie.tag}</span>
              </div>
              <div className="movie-card-body">
                <div className="movie-card-title-row">
                  <h3>{movie.title}</h3>
                  <strong>{movie.rating}</strong>
                </div>
                <div className="movie-card-meta">
                  <span>{movie.year}</span>
                  <span>{movie.genre}</span>
                  <span>{movie.duration}</span>
                </div>
                <p>{movie.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="movie-bottom-panel">
        <div className="movie-rank-card">
          <span>Weekend Chart</span>
          <h3>热门榜单</h3>
          <p>1. Orbit City  2. Silent District  3. Pixel Run</p>
        </div>
        <div className="movie-rank-card">
          <span>Members Club</span>
          <h3>影迷专享</h3>
          <p>收藏片单、影片评分、预告提醒，这里可以继续扩展成真实会员中心。</p>
        </div>
      </section>
    </main>
  );
}

export default MovieCinema;
