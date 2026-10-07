import { useState } from 'react';
import { chapters, searchParagraphs, getParagraphsByChapter } from './data';
import { Chapter, Paragraph } from './data/types';

// Компонент карточки параграфа
function ParagraphCard({ paragraph, onClick }: { paragraph: Paragraph; onClick: () => void }) {
  return (
    <div className="paragraph-card" onClick={onClick}>
      <div className="paragraph-number">{paragraph.number}</div>
      <h3 className="paragraph-title">{paragraph.title}</h3>
      <p className="paragraph-summary">{paragraph.summary}</p>
      <div className="paragraph-meta">
        <span className="meta-dates">📅 {paragraph.keyDates.length} дат</span>
        <span className="meta-figures">👤 {paragraph.keyFigures.length} персон</span>
        <span className="meta-terms">📖 {paragraph.keyTerms.length} терминов</span>
      </div>
    </div>
  );
}

// Модальное окно с детальной информацией о параграфе
function ParagraphModal({ paragraph, onClose }: { paragraph: Paragraph; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="modal-number">{paragraph.number}</div>
          <h2 className="modal-title">{paragraph.title}</h2>
        </div>

        <div className="modal-section">
          <h3>📜 Краткое описание</h3>
          <p className="modal-summary">{paragraph.summary}</p>
        </div>

        <div className="modal-section">
          <h3>📅 Ключевые даты</h3>
          <ul className="modal-list">
            {paragraph.keyDates.map((date, idx) => (
              <li key={idx}>
                <strong>{date.date}</strong> — {date.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3>👤 Ключевые исторические деятели</h3>
          <div className="modal-tags">
            {paragraph.keyFigures.map((figure, idx) => (
              <span key={idx} className="tag figure-tag">{figure}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>📖 Ключевые термины и понятия</h3>
          <div className="modal-tags">
            {paragraph.keyTerms.map((term, idx) => (
              <span key={idx} className="tag term-tag">{term}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>✨ Основные положения</h3>
          <ul className="modal-list main-points">
            {paragraph.mainPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Компонент главы с раскрывающимися параграфами
function ChapterSection({ chapter, onParagraphClick }: { chapter: Chapter; onParagraphClick: (p: Paragraph) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`chapter-section ${isExpanded ? 'expanded' : ''}`}>
      <div className="chapter-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="chapter-info">
          <div className="chapter-number">Глава {chapter.number}</div>
          <h2 className="chapter-title">{chapter.title}</h2>
          <div className="chapter-period">{chapter.period}</div>
        </div>
        <div className="chapter-toggle">{isExpanded ? '▼' : '▶'}</div>
      </div>
      
      {isExpanded && (
        <div className="paragraphs-container">
          {chapter.paragraphs.map(paragraph => (
            <ParagraphCard
              key={paragraph.id}
              paragraph={paragraph}
              onClick={() => onParagraphClick(paragraph)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Главный компонент приложения
function App() {
  const [selectedParagraph, setSelectedParagraph] = useState<Paragraph | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Paragraph[] | null>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchParagraphs(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <div className="app">
      {/* Заголовок */}
      <header className="app-header">
        <div className="header-ornament">✦ ✦ ✦</div>
        <h1>Исторический Таймлайн</h1>
        <h2>Россия. 1914—1945 годы</h2>
        <p className="subtitle">По учебнику Мединского / Торкунова • 10 класс</p>
        <div className="header-ornament">✦ ✦ ✦</div>
      </header>

      {/* Панель поиска */}
      <div className="search-panel">
        <div className="search-row">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="🔍 Поиск по параграфам, терминам, персоналиям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>Найти</button>
          <button className="btn-reset" onClick={handleReset}>Сбросить</button>
        </div>

        {searchResults && (
          <div className="search-results-info">
            Найдено параграфов: {searchResults.length}
          </div>
        )}
      </div>

      {/* Основной контент */}
      <main className="content-container">
        {searchResults ? (
          // Режим поиска
          <div className="search-results">
            <h2 className="results-title">Результаты поиска</h2>
            {searchResults.length === 0 ? (
              <div className="no-results">
                <p>📜 Параграфы не найдены</p>
                <p>Попробуйте изменить поисковый запрос</p>
              </div>
            ) : (
              <div className="paragraphs-grid">
                {searchResults.map(paragraph => (
                  <ParagraphCard
                    key={paragraph.id}
                    paragraph={paragraph}
                    onClick={() => setSelectedParagraph(paragraph)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Режим просмотра глав
          <div className="chapters-list">
            {chapters.map(chapter => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                onParagraphClick={setSelectedParagraph}
              />
            ))}
          </div>
        )}
      </main>

      {/* Модальное окно с деталями параграфа */}
      {selectedParagraph && (
        <ParagraphModal
          paragraph={selectedParagraph}
          onClose={() => setSelectedParagraph(null)}
        />
      )}

      {/* Подвал */}
      <footer className="app-footer">
        <p>Исторический Таймлайн • Учебник «История России. 1914—1945 годы» • 10 класс</p>
        <p>Авторы: Мединский В.Р., Торкунов А.В. • Интерактивное веб-приложение</p>
      </footer>
    </div>
  );
}

export default App;
