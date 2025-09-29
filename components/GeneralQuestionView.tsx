
import React, { useState } from 'react';
import { answerGeneralQuestion } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface GeneralQuestionViewProps {
  curriculumText: string;
  onBack: () => void;
}

const GeneralQuestionView: React.FC<GeneralQuestionViewProps> = ({ curriculumText, onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setError(null);

    try {
      const result = await answerGeneralQuestion(curriculumText, question);
      setAnswer(result);
    } catch (err) {
      console.error(err);
      setError('عذراً، حدث خطأ أثناء محاولة الحصول على إجابة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <div className="mb-6 flex justify-start">
            <Button onClick={onBack} variant="secondary">
                <ArrowRightIcon className="w-5 h-5 transform scale-x-[-1]" />
                <span>العودة للقائمة</span>
            </Button>
        </div>
        <Card>
        <h2 className="text-2xl font-bold text-center mb-4">اسأل عن المنهج</h2>
        <p className="text-slate-600 text-center mb-6">
            اطرح أي سؤال يتعلق بالمنهج الدراسي، وسيقوم الذكاء الاصطناعي بالبحث عن الإجابة في المحتوى الذي قمت بتحميله.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question.trim()} className="sm:w-auto">
            {isLoading ? 'جاري البحث...' : 'اسأل'}
            </Button>
        </form>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        {isLoading && (
            <div className="flex justify-center mt-8">
            <Spinner />
            </div>
        )}

        {answer && !isLoading && (
            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">الإجابة:</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{answer}</p>
            </div>
        )}
        </Card>
    </div>
  );
};

export default GeneralQuestionView;
