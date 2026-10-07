import { textbooks } from './textbook';
import { worldHistoryTextbook } from './worldHistory';
import { Textbook, Chapter, Paragraph } from './types';

// Экспорт всех учебников
export const allTextbooks: Textbook[] = [...textbooks, worldHistoryTextbook];

// Получение всех параграфов из всех глав учебника
export const getAllParagraphs = (textbookId: string): Paragraph[] => {
  const textbook = allTextbooks.find(t => t.id === textbookId);
  if (!textbook) return [];
  return textbook.chapters.flatMap(chapter => chapter.paragraphs);
};

// Поиск параграфа по ID
export const findParagraphById = (textbookId: string, id: string): Paragraph | undefined => {
  return getAllParagraphs(textbookId).find(p => p.id === id);
};

// Поиск параграфов по запросу
export const searchParagraphs = (textbookId: string, query: string): Paragraph[] => {
  const lowerQuery = query.toLowerCase();
  return getAllParagraphs(textbookId).filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.summary.toLowerCase().includes(lowerQuery) ||
    p.keyTerms.some(term => term.toLowerCase().includes(lowerQuery))
  );
};

// Получение параграфов по главе
export const getParagraphsByChapter = (textbookId: string, chapterId: string): Paragraph[] => {
  const textbook = allTextbooks.find(t => t.id === textbookId);
  if (!textbook) return [];
  const chapter = textbook.chapters.find(c => c.id === chapterId);
  return chapter ? chapter.paragraphs : [];
};

// Получение учебника по ID
export const getTextbookById = (id: string): Textbook | undefined => {
  return allTextbooks.find(t => t.id === id);
};
