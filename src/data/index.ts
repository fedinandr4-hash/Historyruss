import textbookData from './textbook.json';
import { Chapter, Paragraph } from './types';

// Преобразование JSON в типизированные данные
export const chapters: Chapter[] = textbookData as Chapter[];

// Получение всех параграфов из всех глав
export const getAllParagraphs = (): Paragraph[] => {
  return chapters.flatMap(chapter => chapter.paragraphs);
};

// Поиск параграфа по ID
export const findParagraphById = (id: string): Paragraph | undefined => {
  return getAllParagraphs().find(p => p.id === id);
};

// Поиск параграфов по запросу
export const searchParagraphs = (query: string): Paragraph[] => {
  const lowerQuery = query.toLowerCase();
  return getAllParagraphs().filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.summary.toLowerCase().includes(lowerQuery) ||
    p.keyTerms.some(term => term.toLowerCase().includes(lowerQuery))
  );
};

// Получение параграфов по главе
export const getParagraphsByChapter = (chapterId: string): Paragraph[] => {
  const chapter = chapters.find(c => c.id === chapterId);
  return chapter ? chapter.paragraphs : [];
};
