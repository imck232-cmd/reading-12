
import React, { useState, useCallback } from 'react';
import type { AppView, Curriculum, QuizQuestion } from './types';
import FileUploadView from './components/FileUploadView';
import MainMenuView from './components/MainMenuView';
import LessonsView from './components/LessonsView';
import GameView from './components/GameView';
import GeneralQuestionView from './components/GeneralQuestionView';
import { structureCurriculum, generateQuiz } from './services/geminiService';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('upload');
  const [curriculumText, setCurriculumText] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<Curriculum | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = async (fileContent: string) => {
    setIsLoading(true);
    setLoadingMessage('جاري تحليل المنهج الدراسي وتنظيم الدروس...');
    setError(null);
    try {
      setCurriculumText(fileContent);
      const data = await structureCurriculum(fileContent);
      setStructuredData(data);
      setCurrentView('menu');
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تحليل الملف. يرجى التأكد من أن الملف يحتوي على محتوى واضح.');
      setCurrentView('upload');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleShowLessons = () => {
    if (structuredData) {
      setCurrentView('lessons');
    } else {
      setError('لا يوجد بيانات لعرضها. يرجى تحميل ملف المنهج أولاً.');
    }
  };
  
  const handleStartGame = useCallback(async () => {
    if (!curriculumText) {
        setError('لا يوجد محتوى للعبة. يرجى تحميل ملف المنهج أولاً.');
        return;
    }
    setIsLoading(true);
    setLoadingMessage('جاري إعداد لعبة ممتعة من المنهج...');
    setError(null);
    try {
        const questions = await generateQuiz(curriculumText);
        setQuizQuestions(questions);
        setCurrentView('game');
    } catch (err) {
        console.error(err);
        setError('لم نتمكن من إنشاء اللعبة. قد يكون هناك مشكلة في الاتصال أو محتوى الملف.');
        setCurrentView('menu');
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  }, [curriculumText]);

  const handleShowQA = () => {
    if (curriculumText) {
      setCurrentView('qa');
    } else {
      setError('لا يوجد محتوى للبحث فيه. يرجى تحميل ملف المنهج أولاً.');
    }
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setError(null);
    setQuizQuestions(null);
  };
  
  const handleReset = () => {
    setCurrentView('upload');
    setCurriculumText(null);
    setStructuredData(null);
    setQuizQuestions(null);
    setError(null);
    setIsLoading(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <FileUploadView onProcessFile={handleFileProcess} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />;
      case 'menu':
        return <MainMenuView onShowLessons={handleShowLessons} onStartGame={handleStartGame} onShowQA={handleShowQA} onReset={handleReset} />;
      case 'lessons':
        return <LessonsView curriculum={structuredData} onBack={handleBackToMenu} />;
      case 'game':
        return <GameView questions={quizQuestions} onBack={handleBackToMenu} onRetry={handleStartGame} />;
      case 'qa':
        return <GeneralQuestionView curriculumText={curriculumText!} onBack={handleBackToMenu} />;
      default:
        return <FileUploadView onProcessFile={handleFileProcess} isLoading={isLoading} loadingMessage={loadingMessage} error={error} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 pb-2">
            مساعد المنهج التفاعلي
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            بوابتك الذكية لتعلم ممتع وفعال
          </p>
        </header>
        <main>
          <div className="max-w-4xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
