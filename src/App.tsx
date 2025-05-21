import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SampleQRCode from './components/SampleQRCode';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if the user is in demo mode
    const userName = localStorage.getItem('userName');
    setIsDemoMode(userName === 'Demo User');

    // Set a default user email if none exists
    if (!localStorage.getItem('currentUserEmail')) {
      localStorage.setItem('currentUserEmail', 'default@example.com');
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <HomeScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/passport" element={<PassportScreen />} />
          <Route path="/passport/:emirateId" element={<PassportScreen />} />
          <Route path="/stamp/:emirateId/:stampId" element={<StampDetailScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/scan" element={<ScannerScreen />} />
          <Route path="/stamp-earned" element={<StampEarnedScreen />} />
          <Route path="/sample-qr" element={<SampleQRCode />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
