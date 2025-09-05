
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, Globe, Users, Brain, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';
import LanguageSelectionModal from './LanguageSelectionModal';
import BaseLanguageModal from './BaseLanguageModal';
import TargetLanguageModal from './TargetLanguageModal';

interface LandingPageProps {
  onLanguageSelect: (languages: { base: string; target: string }) => void;
}

const LandingPage = ({ onLanguageSelect }: LandingPageProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBaseModal, setShowBaseModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'user' } | null>(null);
  const [baseLanguage, setBaseLanguage] = useState<string>("");
  const [targetLanguage, setTargetLanguage] = useState<string>("");

  // Language data (should match Base/Target modals)
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];
  const adminLanguages = [
    ...languages,
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  ];
  const availableLanguages = user?.role === 'admin' ? adminLanguages : languages;

  const handleAuthSuccess = (userData: { name: string; role: 'admin' | 'user' }) => {
    setUser(userData);
    setShowAuthModal(false);
    setShowBaseModal(true);
  };

  const handleBaseSelect = (base: string) => {
    setBaseLanguage(base);
    setShowBaseModal(false);
    setTimeout(() => setShowTargetModal(true), 200); // Small delay for smoothness
  };

  const handleTargetSelect = (target: string) => {
    setTargetLanguage(target);
    setShowTargetModal(false);
    const baseLang = availableLanguages.find(l => l.code === baseLanguage);
    const targetLang = availableLanguages.find(l => l.code === target);
    onLanguageSelect({
      base: baseLang?.name || baseLanguage,
      target: targetLang?.name || target,
    });
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Interactive Lessons",
      description: "Learn through engaging flashcards and immersive exercises designed for all skill levels"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Learning",
      description: "Personalized learning paths that adapt to your progress and learning style"
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Gamification",
      description: "Earn points, unlock achievements, and compete with friends while you learn"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "50+ Languages",
      description: "Choose from a vast library of languages including popular and rare dialects"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      title: "Community",
      description: "Practice with native speakers and join a global community of learners"
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "Expert Content",
      description: "Courses designed by linguistic experts and native speakers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinguaSpark
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="text-gray-600 hover:text-blue-600"
              >
                Login
              </Button>
              <Button 
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Master Any Language
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Transform your language learning journey with AI-powered lessons, 
              interactive exercises, and a global community of learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl"
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login to Continue
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required • Join 1M+ learners
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose LinguaSpark?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of language learning with our cutting-edge platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of learners worldwide and discover how fun language learning can be.
          </p>
          <Button 
            size="lg"
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Step 1: Base Language Modal */}
      <BaseLanguageModal
        isOpen={showBaseModal}
        onClose={() => setShowBaseModal(false)}
        onSelect={handleBaseSelect}
        languages={availableLanguages}
      />
      {/* Step 2: Target Language Modal */}
      <TargetLanguageModal
        isOpen={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        onSelect={handleTargetSelect}
        languages={availableLanguages}
        exclude={baseLanguage}
      />
    </div>
  );
};

export default LandingPage;
