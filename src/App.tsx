import { useState } from 'react';
import { allTextbooks, searchParagraphs, getTextbookById } from './data';
import { Textbook, Chapter, Paragraph } from './data/types';

// Экран выбора учебника
function TextbookSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="textbook-selector">
      <div className="selector-header">
        <div className="header-ornament">✦ ✦ ✦</div>
        <h1>Исторический Таймлайн</h1>
        <p className="subtitle">Выберите учебник для изучения</p>
        <div className="header-ornament">✦ ✦ ✦</div>
      </div>
      
      <div className="textbook-cards">
        {allTextbooks.map(textbook => (
          <div 
            key={textbook.id} 
            className="textbook-card"
            onClick={() => onSelect(textbook.id)}
          >
            <div className="textbook-icon">📚</div>
            <h2 className="textbook-title">{textbook.title}</h2>
            <h3 className="textbook-subtitle">{textbook.subtitle}</h3>
            <p className="textbook-authors">{textbook.authors}</p>
            <p className="textbook-period">{textbook.period}</p>
            <div className="textbook-chapters-count">
              {textbook.chapters.length} глав • {textbook.chapters.reduce((acc, ch) => acc + ch.paragraphs.length, 0)} параграфов
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

// Компонент заключения учебника
function TextbookConclusion({ textbook, onClose }: { textbook: Textbook; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content conclusion-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="modal-number">Заключение</div>
          <h2 className="modal-title">{textbook.title}. {textbook.subtitle}</h2>
        </div>

        <div className="modal-section">
          <p className="conclusion-text">{textbook.conclusion}</p>
        </div>
      </div>
    </div>
  );
}

// Главный компонент приложения
function App() {
  const [selectedTextbookId, setSelectedTextbookId] = useState<string | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<Paragraph | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Paragraph[] | null>(null);
  const [showConclusion, setShowConclusion] = useState(false);

  const selectedTextbook = selectedTextbookId ? getTextbookById(selectedTextbookId) : null;

  const handleSearch = () => {
    if (searchQuery.trim() && selectedTextbookId) {
      const results = searchParagraphs(selectedTextbookId, searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const handleBackToSelector = () => {
    setSelectedTextbookId(null);
    setSearchQuery('');
    setSearchResults(null);
    setSelectedParagraph(null);
  };

  // Если учебник не выбран — показываем экран выбора
  if (!selectedTextbookId || !selectedTextbook) {
    return <TextbookSelector onSelect={setSelectedTextbookId} />;
  }

  return (
    <div className="app">
      {/* Заголовок */}
      <header className="app-header">
        <div className="header-ornament">✦ ✦ ✦</div>
        <h1>{selectedTextbook.title}</h1>
        <h2>{selectedTextbook.subtitle}</h2>
        <p className="subtitle">{selectedTextbook.authors} • {selectedTextbook.period}</p>
        <div className="header-ornament">✦ ✦ ✦</div>
      </header>

      {/* Панель навигации */}
      <div className="nav-panel">
        <button className="btn-back" onClick={handleBackToSelector}>
          ← Выбрать другой учебник
        </button>
        <button className="btn-conclusion" onClick={() => setShowConclusion(true)}>
          📖 Заключение
        </button>
      </div>

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
            {selectedTextbook.chapters.map(chapter => (
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

      {/* Модальное окно заключения */}
      {showConclusion && selectedTextbook && (
        <TextbookConclusion
          textbook={selectedTextbook}
          onClose={() => setShowConclusion(false)}
        />
      )}

      {/* Подвал */}
      <footer className="app-footer">
        <p>Исторический Таймлайн • Учебники Мединского В.Р., Торкунова А.В. • 10 класс</p>
        <p>Интерактивное веб-приложение для изучения истории</p>
      </footer>
    </div>
  );
}

export default App;
