
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Map, Compass, User, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

const emitatesData = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'dubai',
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'sharjah',
    name: 'Sharjah',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'ajman',
    name: 'Ajman',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'umm-al-quwain',
    name: 'Umm Al Quwain',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'fujairah',
    name: 'Fujairah',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }, {
    id: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }
];

const tips = ["Visit Al Ain Zoo in Abu Dhabi for a special stamp!", "Scan QR codes at the Dubai Museum for exclusive stamps.", "Don't forget to explore the Heart of Sharjah for unique stamps!"];

const HomeScreen: React.FC = () => {
  const [activeEmirateIndex, setActiveEmirateIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    isNewUser: false,
    isDemoUser: false,
    points: 0
  });
  
  // State to store the calculated emirate data with actual collected stamps
  const [calculatedEmirateData, setCalculatedEmirateData] = useState(emitatesData);
  
  // Load user data and stamp information
  const loadUserData = () => {
    // Check if user is demo user or new user
    const userName = localStorage.getItem('userName');
    const isNewUser = !localStorage.getItem('hasViewedHomeScreen');
    const isDemoUser = userName === 'Demo User';
    const userPoints = parseInt(localStorage.getItem(getUserStorageKey('userPoints')) || '0', 10);
    
    if (isNewUser) {
      // Mark that user has seen the home screen
      localStorage.setItem('hasViewedHomeScreen', 'true');
    }
    
    setUserData({
      isNewUser,
      isDemoUser,
      points: userPoints
    });
    
    // Load stamps data from localStorage for non-demo users
    if (!isDemoUser) {
      const storedStamps = localStorage.getItem(getUserStorageKey('collectedStamps'));
      
      if (storedStamps) {
        const stampsData = JSON.parse(storedStamps);
        
        // Calculate collected stamps for each emirate
        const updatedEmirateData = emitatesData.map(emirate => {
          const emirateStamps = stampsData[emirate.id] || [];
          return {
            ...emirate,
            collectedStamps: emirateStamps.length
          };
        });
        
        setCalculatedEmirateData(updatedEmirateData);
      } else {
        // If no stored stamps, reset to default
        setCalculatedEmirateData(emitatesData);
      }
    } else {
      // Reset for demo users
      setCalculatedEmirateData(emitatesData);
    }
  };

  // Initial load and setup tip rotation
  useEffect(() => {
    // Load user data and stamps
    loadUserData();
    
    // Rotate tips every 6 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 6000);
    
    return () => clearInterval(tipInterval);
  }, []);
  
  // Listen for focus/visibility changes to refresh data
  useEffect(() => {
    // Function to reload data when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUserData();
      }
    };
    
    // Listen for visibility change events (user switching tabs and coming back)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on window focus (user coming back to the app)
    window.addEventListener('focus', loadUserData);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadUserData);
    };
  }, []);
  
  // Calculate total stamps based on the actual collected stamps data
  const totalCollectedStamps = userData.isNewUser || userData.isDemoUser ? 0 : 
    calculatedEmirateData.reduce((sum, emirate) => sum + emirate.collectedStamps, 0);
  const totalStamps = calculatedEmirateData.reduce((sum, emirate) => sum + emirate.stampCount, 0);
  
  const completionPercentage = userData.isNewUser || userData.isDemoUser ? 0 : 
    Math.round((totalCollectedStamps / totalStamps) * 100);
  
  const handlePassportClick = () => {
    navigate('/passport');
  };
  
  const handleScanClick = () => {
    navigate('/scan');
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-blue text-white p-6 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <img alt="Masar Logo" src="/lovable-uploads/7df6787e-769a-4712-aabe-7322b3d7144b.png" className="h-8 object-fill" />
          <div className="flex items-center space-x-4">
            {/* Points display */}
            <div className="bg-masar-gold/20 text-masar-gold rounded-full px-3 py-1 flex items-center">
              <Award className="w-4 h-4 mr-1" />
              <span className="font-medium">{userData.points} pts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {totalCollectedStamps}/{totalStamps} Stamps
              </span>
              <div className="w-8 h-8 bg-masar-gold/20 rounded-full flex items-center justify-center">
                <Compass className="w-5 h-5 text-masar-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Character Tip Banner */}
      <div className="bg-masar-teal/10 mx-4 my-4 p-4 rounded-xl flex items-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mr-3">
          <img alt="Hamdoon Character" className="w-14 h-14 object-contain" src="/lovable-uploads/2ca123d8-3083-4c49-a682-ea763b97b288.png" />
        </div>
        <div className="flex-1">
          <p className="text-masar-blue font-medium text-sm animate-fade-in key={currentTip}">
            {tips[currentTip]}
          </p>
        </div>
      </div>
      
      {/* Passport Preview */}
      <div className="px-4 my-6">
        <h2 className="text-xl font-serif font-bold text-masar-blue mb-3">Your Explorer Passport</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-44 flex items-center justify-center bg-masar-blue cursor-pointer" onClick={handlePassportClick}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuLWNpcmNsZXMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPjwvcGF0dGVybj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4tY2lyY2xlcykiIC8+PC9zdmc+')] opacity-50"></div>
            <img alt="Masar Logo" src="/lovable-uploads/61478542-9eea-4ce7-97df-c4378c6f5b2b.png" className="w-24 h-auto mb-2 z-10 object-fill" />
            <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-serif text-center">MASAR EXPLORER PASSPORT</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-masar-blue font-medium">Progress</span>
                <span className="text-masar-blue font-semibold">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2 mt-2" />
            </div>
            <Button className="bg-masar-teal hover:bg-masar-teal/90 text-white ml-4 font-semibold" onClick={handlePassportClick}>
              View
            </Button>
          </div>
        </div>
      </div>
      
      {/* Emirates Carousel */}
      <div className="px-4 my-6">
        <h2 className="text-xl font-serif font-bold text-masar-blue mb-3">Explore Emirates</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {calculatedEmirateData.map((emirate, index) => (
              <Card key={emirate.id} className="flex-shrink-0 w-64 overflow-hidden" onClick={() => setActiveEmirateIndex(index)}>
                <div className="relative h-36">
                  <img src={emirate.image} alt={emirate.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div>
                      <h3 className="text-white font-bold">{emirate.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex space-x-1">
                          {[...Array(emirate.stampCount)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-3 rounded-full ${(userData.isNewUser || userData.isDemoUser) ? 'bg-white/30' : (i < emirate.collectedStamps ? 'bg-masar-gold' : 'bg-white/30')}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-white">
                          {userData.isNewUser || userData.isDemoUser ? 0 : emirate.collectedStamps}/{emirate.stampCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <Button 
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/passport/${emirate.id}`);
                    }} 
                    className="w-full bg-masar-mint hover:bg-masar-mint/90 text-masar-red"
                  >
                    View Stamps
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-masar-blue" onClick={() => {}}>
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center" onClick={handleScanClick}>
            <div className="bg-masar-teal rounded-full p-3 -mt-8 border-4 border-white">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs mt-1">Scan</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/profile')}>
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
