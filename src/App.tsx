
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { supabase } from '@/integrations/supabase/client';

// Import components
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import PassportScreen from './components/PassportScreen';
import ProfileScreen from './components/ProfileScreen';
import ScannerScreen from './components/ScannerScreen';
import StampEarnedScreen from './components/StampEarnedScreen';
import StampDetailScreen from './components/StampDetailScreen';
import RewardsScreen from './components/RewardsScreen';
import { Toaster } from './components/ui/toaster';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        
        if (session?.user) {
          const userName = session.user.user_metadata.name;
          setIsDemoMode(userName === 'Demo User');
          
          // Set localStorage values for compatibility with existing code
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', userName || '');
          localStorage.setItem('currentUserEmail', session.user.email || '');
          
          // For new sessions, skip splash screen
          setShowSplash(false);
        }
        
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setShowSplash(true);
          // Clear local storage data
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userName');
          localStorage.removeItem('currentUserEmail');
          localStorage.removeItem('hasViewedHomeScreen');
          localStorage.removeItem('hasViewedProfileBefore');
          // We don't need to navigate here as the route protection below will handle it
        }
      }
    );
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const hasSession = !!session;
        setIsAuthenticated(hasSession);
        
        if (session?.user) {
          const userName = session.user.user_metadata.name;
          setIsDemoMode(userName === 'Demo User');
          
          // Set localStorage values for compatibility with existing code
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', userName || '');
          localStorage.setItem('currentUserEmail', session.user.email || '');
          
          // If user has session, skip splash screen
          setShowSplash(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  // If still loading auth state, show nothing or a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/auth" replace />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthScreen />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} /> {/* Redirect /login to /auth */}
          <Route path="/home" element={isAuthenticated ? <HomeScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/passport" element={isAuthenticated ? <PassportScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/passport/:emirateId" element={isAuthenticated ? <PassportScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/stamp/:emirateId/:stampId" element={isAuthenticated ? <StampDetailScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/profile" element={isAuthenticated ? <ProfileScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/scan" element={isAuthenticated ? <ScannerScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/stamp-earned" element={isAuthenticated ? <StampEarnedScreen /> : <Navigate to="/auth" replace />} />
          <Route path="/rewards" element={isAuthenticated ? <RewardsScreen /> : <Navigate to="/auth" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
