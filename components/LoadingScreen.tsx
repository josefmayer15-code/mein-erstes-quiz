import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [stage, setStage] = useState(0);
  const messages = [
    "Analysiere LinkedIn-Algorithmus...",
    "Generiere Diagnose-Fragen...",
    "Kalibriere Scoring-Logik...",
    "Bereite Ergebnisse vor..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 rounded-full blur animate-pulse"></div>
            <div className="relative bg-white p-4 rounded-full shadow-sm">
               <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">KI generiert dein Audit</h2>
        <p className="text-gray-500 h-6 transition-all duration-300 ease-in-out">
          {messages[stage]}
        </p>
      </div>
    </div>
  );
};
