
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnimatedLoader = ({ text = "Loading..." }: { text?: string }) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.5
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    animate: {
      rotate: 360,
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <motion.div
        variants={sparkleVariants}
        animate="animate"
        className="text-blue-600"
      >
        <Sparkles className="h-12 w-12" />
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        animate="animate"
        className="flex space-x-2"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        ))}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 font-medium"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default AnimatedLoader;
