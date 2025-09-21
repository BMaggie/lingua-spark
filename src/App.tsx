import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import LanguageMiddleware from "@/components/enhanced/LanguageMiddleware";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedLoader from "@/components/AnimatedLoader";
import { Suspense, lazy } from "react";
import AppLayout from "@/components/AppLayout";

// Lazy load all route components
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));

const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const VocabularyQuiz = lazy(() => import("./components/VocabularyQuiz"));
const Leaderboard = lazy(() => import("./components/Leaderboard"));
const VocabularyCard = lazy(() => import("./components/VocabularyCard"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
    <AnimatedLoader text="Loading..." />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageMiddleware>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes without layout */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                {/* Main app wrapped in AppLayout with responsive sidebar */}
                <Route element={<AppLayout />}>
                  <Route 
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/course" element={<CoursePage />} />
                  <Route path="/quiz" element={<VocabularyQuiz languages={{ base: 'English', target: 'Hausa' }} />} />
                  <Route path="/leaderboard" element={<Leaderboard targetLanguage="Hausa" />} />
                  <Route path="/vocabulary" element={<VocabularyCard languages={{ base: 'English', target: 'Hausa' }} />} />
                  <Route path="/achievements" element={<GamePage />} />
                  <Route path="/community" element={<CommunityPage />} />
                </Route>
                {/* Admin retains its own layout */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </LanguageMiddleware>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);

export default App;