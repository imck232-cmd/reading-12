
import React, { useState } from 'react';
import type { Curriculum, Lesson, Question } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface LessonsViewProps {
  curriculum: Curriculum | null;
  onBack: () => void;
}

const QuestionItem: React.FC<{ question: Question }> = ({ question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right p-4 flex justify-between items-center hover:bg-slate-50 transition"
      >
        <span className="font-medium text-slate-700">{question.questionText}</span>
        <svg
          className={`w-5 h-5 text-slate-500 transform transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 text-slate-600">
          <p>{question.answerText}</p>
        </div>
      )}
    </div>
  );
};

const LessonItem: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 !p-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-right p-6 flex justify-between items-center"
      >
        <h3 className="text-xl font-bold text-blue-600">{lesson.title}</h3>
        <svg
          className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-slate-600 mb-4">{lesson.content}</p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {lesson.questions.map((q, index) => (
              <QuestionItem key={index} question={q} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const LessonsView: React.FC<LessonsViewProps> = ({ curriculum, onBack }) => {
  return (
    <div>
      <div className="mb-6 flex justify-start">
        <Button onClick={onBack} variant="secondary">
          <ArrowRightIcon className="w-5 h-5 transform scale-x-[-1]" />
          <span>العودة للقائمة</span>
        </Button>
      </div>
      
      <h2 className="text-3xl font-bold text-center mb-8">دروس المنهج</h2>
      
      {curriculum && curriculum.lessons.length > 0 ? (
        curriculum.lessons.map((lesson, index) => (
          <LessonItem key={index} lesson={lesson} />
        ))
      ) : (
        <Card className="text-center">
          <p>لم يتم العثور على دروس في الملف. يرجى التأكد من أن الملف منظم بشكل صحيح.</p>
        </Card>
      )}
    </div>
  );
};

export default LessonsView;
