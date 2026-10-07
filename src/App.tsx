import { useState, useEffect, useRef } from 'react';
import { events, HistoricalEvent } from './data/events';

// Компонент карточки события
function EventCard({ event, onSelect, isSelected }: { event: HistoricalEvent; onSelect: (e: HistoricalEvent) => void; isSelected: boolean }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г.`;
  };

  const chapterNames: Record<string, string> = {
    'I': 'Россия в Первой мировой войне',
    'II': 'Россия в 1918—1941 годах',
    'III': 'Великая Отечественная война'
  };

  return (
    <div
      className={`event-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(event)}
    >
      <div className="event-date">{formatDate(event.date)}</div>
      <h3 className="event-title">{event.title}</h3>
      <p className="event-description">{event.description}</p>
      <div className="event-meta">
        <span className="event-location">📍 {event.location}</span>
        {event.chapter && <span className="event-chapter">📖 Глава {event.chapter}</span>}
        {event.paragraph && <span className="event-paragraph">{event.paragraph}</span>}
      </div>
      {event.chapter && (
        <div className="chapter-name">{chapterNames[event.chapter]}</div>
      )}
    </div>
  );
}

// Компонент чата
function ChatPanel({ event, onClose }: { event: HistoricalEvent; onClose: () => void }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const context = `${event.title}. ${event.description}`;
    const userMessage = question;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3-coder:30b',
          prompt: `Контекст: ${context}\n\nВопрос: ${userMessage}\n\nОтветь на русском языке, опираясь на контекст.`,
          stream: false
        })
      });

      if (!response.ok) throw new Error('Ошибка сети');
      const data = await response.json();
      const answer = data.response || 'Нет ответа';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Не удалось подключиться к локальному ИИ (Ollama). Убедитесь, что Ollama запущена на localhost:11434 и модель qwen3-coder:30b установлена.\n\nДля запуска: ollama run qwen3-coder:30b'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h3>💬 Вопрос по событию</h3>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>
      <div className="chat-context">
        <strong>{event.title}</strong>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            Задайте вопрос по данному событию. Например: «Какие были последствия?» или «Кто участвовал?»
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="message-role">{msg.role === 'user' ? '🧑 Вы' : '🤖 ИИ'}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant loading">
            <div className="message-role">🤖 ИИ</div>
            <div className="message-content">
              <span className="typing-indicator">
                <span></span><span></span><span></span>
              </span>
              Генерация ответа...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите вопрос..."
          rows={2}
        />
        <button onClick={sendMessage} disabled={isLoading || !question.trim()}>
          {isLoading ? '⏳' : '📤'} Отправить
        </button>
      </div>
    </div>
  );
}

// Главный компонент приложения
function App() {
  const [filteredEvents, setFilteredEvents] = useState<HistoricalEvent[]>(events);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [activeChapter, setActiveChapter] = useState<string>('all');

  // Фильтрация событий
  useEffect(() => {
    let result = [...events];

    // Фильтр по главе
    if (activeChapter !== 'all') {
      result = result.filter(e => e.chapter === activeChapter);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    // Фильтр по году
    if (yearFilter.trim()) {
      result = result.filter(e => e.date.startsWith(yearFilter.trim()));
    }

    setFilteredEvents(result);
  }, [searchQuery, yearFilter, activeChapter]);

  const handleSearch = () => {
    // Фильтрация уже происходит в useEffect
  };

  const handleReset = () => {
    setSearchQuery('');
    setYearFilter('');
    setActiveChapter('all');
    setSelectedEvent(null);
  };

  const chapterNames: Record<string, string> = {
    'all': 'Все главы',
    'I': 'Глава I: Первая мировая',
    'II': 'Глава II: 1918—1941',
    'III': 'Глава III: ВОВ 1941—1945'
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

      {/* Панель поиска и фильтрации */}
      <div className="search-panel">
        <div className="search-row">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="🔍 Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="year-input-group">
            <input
              type="text"
              placeholder="Год (напр. 1917)"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              maxLength={4}
            />
          </div>
          <button className="btn-search" onClick={handleSearch}>Фильтровать</button>
          <button className="btn-reset" onClick={handleReset}>Сбросить</button>
        </div>

        {/* Фильтр по главам */}
        <div className="chapter-filters">
          {Object.entries(chapterNames).map(([key, name]) => (
            <button
              key={key}
              className={`chapter-btn ${activeChapter === key ? 'active' : ''}`}
              onClick={() => setActiveChapter(key)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="results-count">
          Найдено событий: {filteredEvents.length} из {events.length}
        </div>
      </div>

      {/* Таймлайн */}
      <main className="timeline-container">
        <div className="timeline">
          <div className="timeline-line"></div>
          {filteredEvents.map((event, index) => (
            <div key={event.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot"></div>
              <EventCard
                event={event}
                onSelect={setSelectedEvent}
                isSelected={selectedEvent?.id === event.id}
              />
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="no-results">
            <p>📜 События не найдены</p>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </main>

      {/* Панель чата */}
      {selectedEvent && (
        <ChatPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
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
