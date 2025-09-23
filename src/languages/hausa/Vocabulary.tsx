
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface VocabularyProps {
  languages: { base: string; target: string };
}

const HausaVocabulary: React.FC<VocabularyProps> = ({ languages }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-purple-700">Hausa Vocabulary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-600">
            <span className="font-semibold">Base Language:</span> {languages.base} <br />
            <span className="font-semibold">Target Language:</span> {languages.target}
          </div>
          <ul className="space-y-3">
            <li className="p-4 bg-purple-50 rounded-lg shadow-sm">Sannu - Hello</li>
            <li className="p-4 bg-purple-50 rounded-lg shadow-sm">Nagode - Thank you</li>
            <li className="p-4 bg-purple-50 rounded-lg shadow-sm">Abinci - Food</li>
            <li className="p-4 bg-purple-50 rounded-lg shadow-sm">Ruwa - Water</li>
            <li className="p-4 bg-purple-50 rounded-lg shadow-sm">Gida - House</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HausaVocabulary;
