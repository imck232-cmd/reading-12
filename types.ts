
export type AppView = 'upload' | 'menu' | 'lessons' | 'game' | 'qa';

export interface Question {
  questionText: string;
  answerText: string;
}

export interface Lesson {
  title: string;
  content: string;
  questions: Question[];
}

export interface Curriculum {
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
