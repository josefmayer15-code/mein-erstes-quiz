import React from 'react';
import { ResultContent, Category } from '../types';
import { AlertCircle, CheckCircle2, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

interface ResultCardProps {
  result: ResultContent;
  category: Category;
  scores: Record<Category, number>;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, category, scores }) => {
  // Calculate percentage for visualization (max 12 points per category)
  const getPercent = (score: number) => Math.round((score / 12) * 100);

  const getIcon = () => {
    switch(category) {
      case 'A': return <TrendingUp className="w-12 h-12 text-red-500" />;
      case 'B': return <AlertCircle className="w-12 h-12 text-orange-500" />;
      case 'C': return <CheckCircle2 className="w-12 h-12 text-yellow-500" />;
      default: return <TrendingUp className="w-12 h-12" />;
    }
  };

  const getColorClass = () => {
    switch(category) {
      case 'A': return "bg-red-50 border-red-100 text-red-700";
      case 'B': return "bg-orange-50 border-orange-100 text-orange-700";
      case 'C': return "bg-yellow-50 border-yellow-100 text-yellow-700";
      default: return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className={`p-8 border-b ${getColorClass()}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              {getIcon()}
            </div>
            <div>
              <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Deine Diagnose</div>
              <h2 className="text-3xl font-extrabold">{result.title}</h2>
            </div>
          </div>
          <p className="text-lg font-medium opacity-90 leading-relaxed max-w-2xl">
            "{result.painPoint}"
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Analysis */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
              Die Analyse
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Basierend auf deinen Antworten haben wir identifiziert, dass dein größter Engpass aktuell hier liegt. {result.solution}
            </p>
          </div>

          {/* Scores Visualization */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Dein Score-Profil</h4>
            <div className="space-y-4">
              {/* Bar A */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Posting (Sichtbarkeit)</span>
                  <span className={category === 'A' ? 'text-red-600 font-bold' : 'text-gray-600'}>{scores['A']}/12</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${category === 'A' ? 'bg-red-500' : 'bg-blue-300'}`} 
                    style={{ width: `${getPercent(scores['A'])}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Bar B */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Messaging (Konversion)</span>
                  <span className={category === 'B' ? 'text-orange-600 font-bold' : 'text-gray-600'}>{scores['B']}/12</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${category === 'B' ? 'bg-orange-500' : 'bg-blue-300'}`} 
                    style={{ width: `${getPercent(scores['B'])}%` }}
                  ></div>
                </div>
              </div>

              {/* Bar C */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Kampagnen (Skalierung)</span>
                  <span className={category === 'C' ? 'text-yellow-600 font-bold' : 'text-gray-600'}>{scores['C']}/12</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${category === 'C' ? 'bg-yellow-500' : 'bg-blue-300'}`} 
                    style={{ width: `${getPercent(scores['C'])}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">
              *Niedriger Score zeigt den größten Handlungsbedarf (Hebel) an.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-blue-600 rounded-xl p-8 text-center text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/2 -translate-y-1/2">
              <Calendar className="w-64 h-64" />
            </div>
            <h3 className="text-2xl font-bold mb-3 relative z-10">Nächster Schritt</h3>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto relative z-10">
              {result.cta}
            </p>
            <button 
              onClick={() => window.open('https://calendly.com', '_blank')}
              className="relative z-10 inline-flex items-center gap-2 bg-white text-blue-700 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Kostenloses Strategie-Gespräch buchen
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
