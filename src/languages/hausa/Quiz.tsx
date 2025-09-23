
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface QuizProps {
  languages: { base: string; target: string };
}

const HausaQuiz: React.FC<QuizProps> = ({ languages }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-green-700">Hausa Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-600">
            <span className="font-semibold">Base Language:</span> {languages.base} <br />
            <span className="font-semibold">Target Language:</span> {languages.target}
          </div>
          <ul className="space-y-3">
            <li className="p-4 bg-green-50 rounded-lg shadow-sm">Quiz 1: Greetings</li>
            <li className="p-4 bg-green-50 rounded-lg shadow-sm">Quiz 2: Numbers</li>
            <li className="p-4 bg-green-50 rounded-lg shadow-sm">Quiz 3: Family</li>
            <li className="p-4 bg-green-50 rounded-lg shadow-sm">Quiz 4: Food</li>
            <li className="p-4 bg-green-50 rounded-lg shadow-sm">Quiz 5: Places</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HausaQuiz;
