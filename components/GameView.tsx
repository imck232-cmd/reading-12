
import React, { useState, useMemo } from 'react';
import type { QuizQuestion } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import ArrowRightIcon from './icons/ArrowRightIcon';


interface GameViewProps {
  questions: QuizQuestion[] | null;
  onBack: () => void;
  onRetry: () => void;
}

const GameView: React.FC<GameViewProps> = ({ questions, onBack, onRetry }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const shuffledOptions = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    return [...questions[currentQuestionIndex].options].sort(() => Math.random() - 0.5);
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === questions![currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions!.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };
  
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    onRetry();
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-blue-50 border-slate-300';
    }
    if (option === questions![currentQuestionIndex].correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-800 font-bold';
    }
    if (option === selectedAnswer) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-white border-slate-300 opacity-60';
  };

  if (!questions) {
    return (
      <Card className="text-center">
        <Spinner />
        <p className="mt-4">جاري تحميل اللعبة...</p>
      </Card>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card className="text-center">
        <h2 className="text-3xl font-bold mb-4">انتهت اللعبة!</h2>
        <p className="text-xl text-slate-700 mb-6">
          نتيجتك هي: <span className="font-bold text-blue-600">{score}</span> من <span className="font-bold text-blue-600">{questions.length}</span> ({percentage}%)
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handlePlayAgain}>إعادة اللعب</Button>
          <Button onClick={onBack} variant="secondary">العودة للقائمة</Button>
        </div>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <div className="mb-6 flex justify-start">
        <Button onClick={onBack} variant="secondary">
            <ArrowRightIcon className="w-5 h-5 transform scale-x-[-1]" />
            <span>العودة للقائمة</span>
        </Button>
      </div>
      <Card>
        <p className="text-slate-500 mb-2">
          السؤال {currentQuestionIndex + 1} من {questions.length}
        </p>
        <h2 className="text-2xl font-bold mb-6 min-h-[6rem]">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {shuffledOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              disabled={isAnswered}
              className={`w-full text-right p-4 border rounded-lg transition-all duration-200 text-lg ${getButtonClass(option)}`}
            >
              {option}
            </button>
          ))}
        </div>
        {isAnswered && (
          <div className="mt-6 text-center">
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GameView;
