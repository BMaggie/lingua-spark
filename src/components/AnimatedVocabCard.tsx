
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from 'lucide-react';

interface VocabItem {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
}

interface AnimatedVocabCardProps {
  vocab: VocabItem;
  onNext: () => void;
  onPrevious: () => void;
}

const AnimatedVocabCard = ({ vocab, onNext, onPrevious }: AnimatedVocabCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className="relative preserve-3d w-full h-80 cursor-pointer"
        variants={cardVariants}
        animate={isFlipped ? "back" : "front"}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AnimatePresence mode="wait">
              {!isFlipped && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.h2 
                    className="text-4xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {vocab.word}
                  </motion.h2>
                  <motion.p 
                    className="text-lg opacity-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.2 }}
                  >
                    /{vocab.pronunciation}/
                  </motion.p>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add text-to-speech functionality here
                      }}
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-pink-500 text-white border-0 shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AnimatePresence mode="wait">
              {isFlipped && (
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <motion.h2 
                    className="text-3xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {vocab.translation}
                  </motion.h2>
                  <motion.p 
                    className="text-sm opacity-90 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{vocab.example}"
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Control buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleFlip} variant="ghost" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={onNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Next
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedVocabCard;
