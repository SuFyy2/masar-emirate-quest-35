
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

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

  useEffect(() => {
    // Check if the user is in demo mode
    const userName = localStorage.getItem('userName');
    const sessionToken = localStorage.getItem('sessionToken');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    
    setIsDemoMode(userName === 'Demo User');
    setIsAuthenticated(authStatus && !!sessionToken && !!currentUserEmail);

    // Set a default user email if none exists (legacy support)
    if (!localStorage.getItem('currentUserEmail')) {
      localStorage.setItem('currentUserEmail', 'default@example.com');
    }
    
    // If user refreshes the page and isn't authenticated, make sure to show splash screen
    if (!authStatus || !sessionToken) {
      setShowSplash(true);
    } else {
      // User is authenticated, skip splash screen
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <Navigate to="/home" replace />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
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
