import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, Globe, Users, Brain, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelectionModal from './LanguageSelectionModal';
import HeroImages from './HeroImages';
import ScrollAnimation from './ScrollAnimations';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface LandingPageProps {
  onLanguageSelect: (languages: { base: string; target: string }) => void;
}

const LandingPage = ({ onLanguageSelect }: LandingPageProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      // User is authenticated, show language selection
      setShowLanguageModal(true);
    } else {
      // Redirect to auth page for signup
      navigate('/auth');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLanguageSelection = (languages: { base: string; target: string }) => {
    setShowLanguageModal(false);
    onLanguageSelect(languages);
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Learn Fast",
      description: "Master new languages 3x faster with our proven method. See results in just 15 minutes a day!"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Make it Fun",
      description: "Gamified lessons that feel like playing games. Learning has never been this enjoyable!"
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Stay Motivated",
      description: "Streaks, achievements, and rewards keep you coming back for more learning fun"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "50+ Languages",
      description: "From Spanish to Japanese, find your perfect language match and start speaking today"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      title: "Learn Together",
      description: "Join millions of learners worldwide. Practice with native speakers and make friends"
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: "Expert-Made",
      description: "Content created by language experts and native speakers for authentic learning"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section with Images */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          {/* Navigation */}
          <motion.nav 
            className="flex justify-between items-center mb-16"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="h-8 w-8 text-blue-600 animate-pulse-glow" />
              <h1 className="text-2xl font-bold gradient-text">
                LinguaSpark
              </h1>
            </motion.div>
            <div className="flex space-x-4">
              {!isAuthenticated ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogin}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-glow"
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover-glow"
                  >
                    Continue Learning
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.nav>

          {/* Hero Content with Images */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-left max-w-2xl"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-5xl md:text-7xl font-bold gradient-text mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Learn Languages Fast & Fun
              </motion.h2>
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Speak a new language in just 30 days! Our fun, bite-sized lessons make learning 
                addictive. Join millions who've discovered the fastest way to become fluent.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 items-start"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover-lift"
                  >
                    {isAuthenticated ? 'Continue Learning' : 'Start Learning Today'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                {!isAuthenticated && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={handleLogin}
                      className="px-8 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover-lift"
                    >
                      Login to Continue
                    </Button>
                  </motion.div>
                )}
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Free to start • No credit card required • Join 1M+ learners
              </motion.p>
            </motion.div>

            {/* Hero Images */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <HeroImages />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section with 3D Elements */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Learning Made Simple
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why millions choose LinguaSpark for fast, fun, and effective language learning
            </p>
          </ScrollAnimation>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center hover:shadow-xl transition-all duration-300 hover-lift border-0 shadow-lg group">
                  <CardHeader>
                    <motion.div 
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-semibold text-gray-800 group-hover:gradient-text transition-all duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <ScrollAnimation direction="up">
        <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h3 
              className="text-4xl font-bold text-white mb-6"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Start Speaking Today!
            </motion.h3>
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join millions who've already transformed their lives through language learning. It's fast, fun, and works!
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover-lift"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Footer */}
      <Footer />

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onLanguageSelect={handleLanguageSelection}
        userRole={user?.role || 'user'}
      />
    </div>
  );
};

export default LandingPage;