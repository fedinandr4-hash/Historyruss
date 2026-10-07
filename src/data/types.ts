// Структура данных учебника
export interface KeyDate {
  date: string;
  text: string;
}

export interface Paragraph {
  id: string;
  number: string;
  title: string;
  summary: string;
  keyDates: KeyDate[];
  keyFigures: string[];
  keyTerms: string[];
  mainPoints: string[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  period: string;
  paragraphs: Paragraph[];
}

export interface Textbook {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  period: string;
  conclusion: string;
  chapters: Chapter[];
}
