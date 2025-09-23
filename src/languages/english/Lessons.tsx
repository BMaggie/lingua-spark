
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LessonsProps {
  languages: { base: string; target: string };
}

const EnglishLessons: React.FC<LessonsProps> = ({ languages }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">English Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-600">
            <span className="font-semibold">Base Language:</span> {languages.base} <br />
            <span className="font-semibold">Target Language:</span> {languages.target}
          </div>
          <ul className="space-y-3">
            <li className="p-4 bg-blue-50 rounded-lg shadow-sm">Lesson 1: Greetings in English</li>
            <li className="p-4 bg-blue-50 rounded-lg shadow-sm">Lesson 2: Numbers and Counting</li>
            <li className="p-4 bg-blue-50 rounded-lg shadow-sm">Lesson 3: Family and Friends</li>
            <li className="p-4 bg-blue-50 rounded-lg shadow-sm">Lesson 4: Food and Drinks</li>
            <li className="p-4 bg-blue-50 rounded-lg shadow-sm">Lesson 5: Places and Directions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnglishLessons;
