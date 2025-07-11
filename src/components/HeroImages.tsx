
import { motion } from 'framer-motion';

const HeroImages = () => {
  const learningImages = [
    {
      src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop",
      alt: "Woman learning on laptop",
      className: "rounded-lg shadow-xl"
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop", 
      alt: "Woman studying with laptop",
      className: "rounded-lg shadow-lg"
    },
    {
      src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop",
      alt: "Person using MacBook Pro",
      className: "rounded-lg shadow-md"
    }
  ];

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {learningImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.2,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: index % 2 === 0 ? 2 : -2,
              transition: { duration: 0.3 }
            }}
            className={`${index === 2 ? 'col-span-2 justify-self-center max-w-sm' : ''}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className={`${image.className} w-full h-auto object-cover hover:shadow-2xl transition-shadow duration-300`}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-60"
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-40"
        animate={{ 
          y: [0, 15, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};

export default HeroImages;
