import heroImage from '@/assets/hero-bg-students.jpg';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(20, 184, 166, 0.15) 100%), url('${heroImage}')`
        }}
      />
    </div>
  );
};

export default HeroBackground;