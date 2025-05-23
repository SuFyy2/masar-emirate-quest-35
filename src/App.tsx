
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
          <Route path="/" element={showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <Navigate to="/home" replace />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/auth" element={isAuthenticated ? <Navigate to="/home" replace /> : <AuthScreen />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} /> {/* Redirect /login to /auth */}
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/passport" element={<PassportScreen />} />
          <Route path="/passport/:emirateId" element={<PassportScreen />} />
          <Route path="/stamp/:emirateId/:stampId" element={<StampDetailScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/scan" element={<ScannerScreen />} />
          <Route path="/stamp-earned" element={<StampEarnedScreen />} />
          <Route path="/rewards" element={<RewardsScreen />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
