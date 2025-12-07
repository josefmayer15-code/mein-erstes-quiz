import React, { useEffect, useState, useMemo } from 'react';
import { generateQuizContent } from './services/quizService';
import { QuizData, Category, ResultContent } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizCard } from './components/QuizCard';
import { ResultCard } from './components/ResultCard';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await generateQuizContent();
        setQuizData(data);
      } catch (e) {
        console.error("Failed to load quiz", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (value: number) => {
    if (!quizData) return;
    
    setAnswers(prev => ({
      ...prev,
      [quizData.questions[currentQuestionIdx].id]: value
    }));

    if (currentQuestionIdx < quizData.questions.length - 1) {
      setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300); // Small delay for UX
    } else {
      setTimeout(() => setFinished(true), 300);
    }
  };

  const results = useMemo(() => {
    if (!quizData || !finished) return null;

    const scores: Record<Category, number> = { A: 0, B: 0, C: 0 };
    
    // Calculate raw scores
    quizData.questions.forEach(q => {
      const val = answers[q.id] || 0;
      scores[q.category] += val;
    });

    // Strategy: Identify the Weakest Link (Lowest Score)
    // If scores are equal, prioritize funnel order: A (Posting) -> B (Messaging) -> C (Campaigns)
    let lowestCategory: Category = 'A';
    let minScore = Infinity;

    // Order of check matters for tie-breaking. 
    // If we want to prioritize A as the problem in a tie, we check A last? No.
    // We want: if A=5, B=5, C=8 -> Problem is A (Top of funnel).
    // So we iterate C, B, A to let A overwrite if it's <= current min.
    
    (['C', 'B', 'A'] as Category[]).forEach(cat => {
      if (scores[cat] <= minScore) {
        minScore = scores[cat];
        lowestCategory = cat;
      }
    });

    const resultData: ResultContent = quizData.results[lowestCategory];

    return {
      category: lowestCategory,
      content: resultData,
      scores
    };
  }, [quizData, finished, answers]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Fehler beim Laden des Quiz. Bitte Seite neu laden.
      </div>
    );
  }

  // Landing Page
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            LinkedIn Audit Tool
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Der <span className="text-blue-600">"5 Gespräche pro Woche"</span> Reifegrad-Check
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Identifiziere in weniger als 2 Minuten, warum du deine Umsatzziele auf LinkedIn noch nicht erreichst.
            Wir analysieren Posting, Messaging und Kampagnen.
          </p>

          <div className="pt-8">
            <button 
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ring-4 ring-blue-50"
            >
              Jetzt Analyse starten
            </button>
            <p className="mt-4 text-sm text-slate-400">Dauer: ca. 90 Sekunden • Kostenlos</p>
          </div>
        </div>
      </div>
    );
  }

  // Result Page
  if (finished && results) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <ResultCard 
          result={results.content} 
          category={results.category} 
          scores={results.scores} 
        />
      </div>
    );
  }

  // Quiz Page
  const currentQ = quizData.questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / quizData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Progress */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
             <LayoutDashboard className="w-5 h-5 text-blue-600" />
             <span>Reifegrad-Check</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="h-1 bg-gray-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <QuizCard 
          question={currentQ}
          currentNumber={currentQuestionIdx + 1}
          totalQuestions={quizData.questions.length}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default App;
