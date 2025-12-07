export type Category = 'A' | 'B' | 'C';

export interface Option {
  label: string; // 'A', 'B', 'C'
  text: string;
  value: number; // 1 (Weak), 2 (Medium), 3 (Strong)
}

export interface Question {
  id: number;
  category: Category;
  text: string;
  options: Option[];
}

export interface ResultContent {
  title: string;
  painPoint: string;
  solution: string;
  cta: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
  results: Record<Category, ResultContent>;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, number>; // questionId -> value
  isFinished: boolean;
  score: Record<Category, number>;
}
