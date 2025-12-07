import React from 'react';
import { Question, Option } from '../types';
import { ArrowRight } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  currentNumber, 
  totalQuestions, 
  onAnswer 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Frage {currentNumber} von {totalQuestions}</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 leading-tight">{question.text}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option.value)}
            className="w-full group text-left p-6 rounded-xl border-2 border-gray-100 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border
                ${option.label === 'A' ? 'bg-gray-50 border-gray-200 text-gray-500 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600' : ''}
                ${option.label === 'B' ? 'bg-gray-50 border-gray-200 text-gray-500 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600' : ''}
                ${option.label === 'C' ? 'bg-gray-50 border-gray-200 text-gray-500 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600' : ''}
              `}>
                {option.label}
              </span>
              <span className="text-lg text-gray-700 group-hover:text-gray-900 font-medium">{option.text}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
