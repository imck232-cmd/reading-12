
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface MainMenuViewProps {
  onShowLessons: () => void;
  onStartGame: () => void;
  onShowQA: () => void;
  onReset: () => void;
}

const MenuItem: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
  <button onClick={onClick} className="w-full text-right p-6 bg-slate-100 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all duration-300 flex items-center gap-6 focus:outline-none focus:ring-2 focus:ring-blue-500">
    <div className="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="text-slate-600 mt-1">{description}</p>
    </div>
  </button>
);

const MainMenuView: React.FC<MainMenuViewProps> = ({ onShowLessons, onStartGame, onShowQA, onReset }) => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">مرحباً بك!</h2>
        <p className="text-slate-600 mb-8">اختر نشاطًا للبدء.</p>
      </div>
      <div className="space-y-6">
        <MenuItem
          icon={<SparklesIcon className="w-8 h-8"/>}
          title="لعبة متنوعة"
          description="اختبر معلوماتك مع ألعاب وأنشطة تعليمية ممتعة."
          onClick={onStartGame}
        />
        <MenuItem
          icon={<BookOpenIcon className="w-8 h-8"/>}
          title="الدروس"
          description="تصفح جميع الدروس وأسئلة التقويم والإجابات النموذجية."
          onClick={onShowLessons}
        />
        <MenuItem
          icon={<BrainCircuitIcon className="w-8 h-8"/>}
          title="اسأل عن المنهج"
          description="اطرح أي سؤال، وسأجيبك من داخل محتوى المنهج فقط."
          onClick={onShowQA}
        />
      </div>
      <div className="mt-8 text-center">
        <Button onClick={onReset} variant="secondary">
          تحميل منهج جديد
        </Button>
      </div>
    </Card>
  );
};

export default MainMenuView;
