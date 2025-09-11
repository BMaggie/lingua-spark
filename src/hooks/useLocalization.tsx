import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    welcome: 'Welcome back',
    dashboard: 'Dashboard',
    lessons: 'Lessons',
    practice: 'Practice',
    quiz: 'Quiz',
    achievements: 'Achievements',
    community: 'Community',
    profile: 'Profile',
    logout: 'Logout',
    wordsLearned: 'Words Learned',
    streak: 'Day Streak',
    points: 'Points',
    level: 'Level',
    startLearning: 'Start Learning',
    continueLesson: 'Continue Lesson',
    greeting: 'Hello',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    todaysGoal: "Today's Goal",
    weeklyProgress: 'Weekly Progress',
    recentAchievements: 'Recent Achievements',
  },
  es: {
    welcome: 'Bienvenido de nuevo',
    dashboard: 'Panel',
    lessons: 'Lecciones',
    practice: 'Práctica',
    quiz: 'Cuestionario',
    achievements: 'Logros',
    community: 'Comunidad',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    wordsLearned: 'Palabras Aprendidas',
    streak: 'Racha de Días',
    points: 'Puntos',
    level: 'Nivel',
    startLearning: 'Comenzar a Aprender',
    continueLesson: 'Continuar Lección',
    greeting: 'Hola',
    goodMorning: 'Buenos días',
    goodAfternoon: 'Buenas tardes',
    goodEvening: 'Buenas noches',
    todaysGoal: 'Meta de Hoy',
    weeklyProgress: 'Progreso Semanal',
    recentAchievements: 'Logros Recientes',
  },
  fr: {
    welcome: 'Bienvenue',
    dashboard: 'Tableau de bord',
    lessons: 'Leçons',
    practice: 'Pratique',
    quiz: 'Quiz',
    achievements: 'Réalisations',
    community: 'Communauté',
    profile: 'Profil',
    logout: 'Déconnexion',
    wordsLearned: 'Mots Appris',
    streak: 'Série de Jours',
    points: 'Points',
    level: 'Niveau',
    startLearning: 'Commencer à Apprendre',
    continueLesson: 'Continuer la Leçon',
    greeting: 'Bonjour',
    goodMorning: 'Bonjour',
    goodAfternoon: 'Bon après-midi',
    goodEvening: 'Bonsoir',
    todaysGoal: "Objectif d'Aujourd'hui",
    weeklyProgress: 'Progrès Hebdomadaire',
    recentAchievements: 'Réalisations Récentes',
  },
  de: {
    welcome: 'Willkommen zurück',
    dashboard: 'Dashboard',
    lessons: 'Lektionen',
    practice: 'Übung',
    quiz: 'Quiz',
    achievements: 'Erfolge',
    community: 'Gemeinschaft',
    profile: 'Profil',
    logout: 'Abmelden',
    wordsLearned: 'Gelernte Wörter',
    streak: 'Tagesstreak',
    points: 'Punkte',
    level: 'Level',
    startLearning: 'Lernen Beginnen',
    continueLesson: 'Lektion Fortsetzen',
    greeting: 'Hallo',
    goodMorning: 'Guten Morgen',
    goodAfternoon: 'Guten Tag',
    goodEvening: 'Guten Abend',
    todaysGoal: 'Heutiges Ziel',
    weeklyProgress: 'Wöchentlicher Fortschritt',
    recentAchievements: 'Aktuelle Erfolge',
  },
  pt: {
    welcome: 'Bem-vindo de volta',
    dashboard: 'Painel',
    lessons: 'Lições',
    practice: 'Prática',
    quiz: 'Quiz',
    achievements: 'Conquistas',
    community: 'Comunidade',
    profile: 'Perfil',
    logout: 'Sair',
    wordsLearned: 'Palavras Aprendidas',
    streak: 'Sequência de Dias',
    points: 'Pontos',
    level: 'Nível',
    startLearning: 'Começar a Aprender',
    continueLesson: 'Continuar Lição',
    greeting: 'Olá',
    goodMorning: 'Bom dia',
    goodAfternoon: 'Boa tarde',
    goodEvening: 'Boa noite',
    todaysGoal: 'Meta de Hoje',
    weeklyProgress: 'Progresso Semanal',
    recentAchievements: 'Conquistas Recentes',
  },
  zh: {
    welcome: '欢迎回来',
    dashboard: '仪表板',
    lessons: '课程',
    practice: '练习',
    quiz: '测验',
    achievements: '成就',
    community: '社区',
    profile: '个人资料',
    logout: '退出',
    wordsLearned: '学会的单词',
    streak: '连续天数',
    points: '积分',
    level: '等级',
    startLearning: '开始学习',
    continueLesson: '继续课程',
    greeting: '你好',
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    todaysGoal: '今日目标',
    weeklyProgress: '周进度',
    recentAchievements: '最近成就',
  }
};

interface LocalizationContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  getGreeting: () => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ 
  children, 
  defaultLanguage = 'en' 
}: { 
  children: ReactNode;
  defaultLanguage?: string;
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      localStorage.setItem('appLanguage', language);
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return t('goodMorning');
    } else if (hour < 18) {
      return t('goodAfternoon');
    } else {
      return t('goodEvening');
    }
  };

  return (
    <LocalizationContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      getGreeting
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};