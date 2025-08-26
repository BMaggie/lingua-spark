
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, Globe, Users, Brain, Trophy, ArrowRight, Sparkles, Check, MessageCircle, Zap, Shield, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import BaseLanguageModal from './BaseLanguageModal';
import TargetLanguageModal from './TargetLanguageModal';
import ProfileModal from './ProfileModal';
import ScrollAnimation from './ScrollAnimations';
import Footer from './Footer';
import ProfileDropdown from './ProfileDropdown';
import MobileNav from './MobileNav';
import HeroBackground from './HeroBackground';
import { useAuth } from '@/hooks/useAuth';

interface LandingPageProps {
  onLanguageSelect: (languages: { base: string; target: string }) => void;
}

const LandingPage = ({ onLanguageSelect }: LandingPageProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showBaseLanguageModal, setShowBaseLanguageModal] = useState(false);
  const [showTargetLanguageModal, setShowTargetLanguageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBaseLanguage, setSelectedBaseLanguage] = useState<string>('');

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      setShowBaseLanguageModal(true);
    } else {
      navigate('/auth');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleBaseLanguageSelect = (language: string) => {
    setSelectedBaseLanguage(language);
    setShowBaseLanguageModal(false);
    setShowTargetLanguageModal(true);
  };

  const handleTargetLanguageSelect = (language: string) => {
    setShowTargetLanguageModal(false);
    onLanguageSelect({ base: selectedBaseLanguage, target: language });
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "AI-Powered Learning",
      description: "Personalized lessons that adapt to your learning style and pace for maximum retention"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Interactive Practice",
      description: "Real conversations with native speakers and AI tutors for authentic language experience"
    },
    {
      icon: <Trophy className="h-8 w-8 text-orange-500" />,
      title: "Gamified Progress",
      description: "Earn points, unlock achievements, and compete with friends in your language journey"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "50+ Languages",
      description: "Learn any language from Spanish to Mandarin with expert-crafted curriculum"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Global Community",
      description: "Connect with millions of learners worldwide and practice together"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Proven Results",
      description: "94% of users become conversational within 3 months of consistent practice"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      content: "LinguaSpark transformed my Spanish learning journey. I went from zero to conversational in just 2 months!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Software Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The AI tutor feels like having a personal teacher. The lessons are engaging and actually fun!",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "I've tried many language apps, but LinguaSpark's approach is revolutionary. Highly recommended!",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 lessons per day",
        "Basic vocabulary",
        "Community access",
        "Mobile app"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited lessons",
        "AI conversation partner",
        "Advanced grammar",
        "Offline mode",
        "Progress tracking",
        "Certificate of completion"
      ],
      popular: true
    },
    {
      name: "Family",
      price: "$19.99",
      period: "per month",
      features: [
        "Up to 6 accounts",
        "All Premium features",
        "Family progress dashboard",
        "Priority support",
        "Custom learning paths"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinguaSpark
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <ProfileDropdown onProfileClick={() => setShowProfileModal(true)} />
                  </div>
                  <MobileNav />
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleLogin} className="text-gray-600 hover:text-blue-600">
                      Sign In
                    </Button>
                    <Button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      Get Started Free
                    </Button>
                  </div>
                  <MobileNav />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <HeroBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              className="text-left"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
              >
                <Star className="h-4 w-4 mr-2" />
                Trusted by 2M+ learners worldwide
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Master Any Language
                </span>
                <br />
                <span className="text-gray-900">In Record Time</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Join millions learning with our AI-powered platform. Speak confidently in just 30 days with personalized lessons that adapt to your learning style.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  {isAuthenticated ? 'Continue Learning' : 'Start Free Trial'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-6 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Images */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10">
                {/* Main app mockup */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop"
                    alt="People learning together"
                    className="rounded-2xl w-full h-80 object-cover mb-4"
                  />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Interactive Lessons</h3>
                    <p className="text-gray-600 text-sm">Learn with real conversations</p>
                  </div>
                </div>
                
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-8 bg-white rounded-xl shadow-lg p-4 max-w-xs hidden lg:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop"
                    alt="Woman studying"
                    className="rounded-lg w-full h-24 object-cover mb-2"
                  />
                  <p className="text-sm font-medium">Sarah: "Fluent in 2 months!"</p>
                </motion.div>
                
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-lg p-4 max-w-xs hidden lg:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
                    alt="Man with headphones"
                    className="rounded-lg w-full h-24 object-cover mb-2"
                  />
                  <p className="text-sm font-medium">Marcus: "Love the AI tutor!"</p>
                </motion.div>
              </div>
              
              {/* Background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LinguaSpark?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of language learning with cutting-edge AI technology and proven teaching methods
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                <Card className="text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50/50">
                  <CardHeader className="pb-4">
                    <motion.div 
                      className="flex justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                        {feature.icon}
                      </div>
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Millions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community of learners has to say about their language learning journey
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.2}>
                <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learning Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade anytime. All plans include our core features and 24/7 support
            </p>
          </ScrollAnimation>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                <Card className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50' 
                    : 'border-0 shadow-lg bg-white'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    <Button 
                      className={`w-full mt-8 py-3 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={handleGetStarted}
                    >
                      {plan.name === 'Free' ? 'Start Free' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollAnimation direction="up">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Language Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join over 2 million learners who've transformed their lives through language learning with LinguaSpark
            </p>
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1"
            >
              Start Learning Today - It's Free!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-blue-200 mt-4">
              No commitment required • Start speaking in 30 days
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BaseLanguageModal
        isOpen={showBaseLanguageModal}
        onClose={() => setShowBaseLanguageModal(false)}
        onLanguageSelect={handleBaseLanguageSelect}
      />

      <TargetLanguageModal
        isOpen={showTargetLanguageModal}
        onClose={() => setShowTargetLanguageModal(false)}
        onLanguageSelect={handleTargetLanguageSelect}
        baseLanguage={selectedBaseLanguage}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default LandingPage;
