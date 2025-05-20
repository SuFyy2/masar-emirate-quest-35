
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Map, Compass, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const emitatesData = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 2
  },
  {
    id: 'dubai',
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 3
  },
  {
    id: 'sharjah',
    name: 'Sharjah',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  },
  {
    id: 'ajman',
    name: 'Ajman',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 1
  },
  {
    id: 'umm-al-quwain',
    name: 'Umm Al Quwain',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  },
  {
    id: 'fujairah',
    name: 'Fujairah',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  },
  {
    id: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    stampCount: 5,
    collectedStamps: 0
  }
];

const tips = [
  "Visit Al Ain Zoo in Abu Dhabi for a special stamp!",
  "Scan QR codes at the Dubai Museum for exclusive stamps.",
  "Don't forget to explore the Heart of Sharjah for unique stamps!"
];

const HomeScreen = () => {
  const [activeEmirateIndex, setActiveEmirateIndex] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Rotate tips every 6 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 6000);
    
    return () => clearInterval(tipInterval);
  }, []);
  
  const totalCollectedStamps = emitatesData.reduce((sum, emirate) => sum + emirate.collectedStamps, 0);
  const totalStamps = emitatesData.reduce((sum, emirate) => sum + emirate.stampCount, 0);
  
  const handlePassportClick = () => {
    navigate('/passport');
  };
  
  const handleScanClick = () => {
    navigate('/scan');
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-teal text-white p-6 rounded-b-2xl">
        <div className="flex justify-between items-center">
          <img 
            src="/lovable-uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
            alt="Masar Logo" 
            className="h-8"
          />
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
      
      {/* Character Tip Banner */}
      <div className="bg-masar-mint/30 mx-4 my-4 p-4 rounded-xl flex items-center">
        <div className="w-14 h-14 bg-masar-mint rounded-full flex items-center justify-center mr-3">
          {/* Placeholder for character image */}
          <span className="text-2xl">🧙</span>
        </div>
        <div className="flex-1">
          <p className="text-masar-teal font-medium text-sm animate-fade-in key={currentTip}">
            {tips[currentTip]}
          </p>
        </div>
      </div>
      
      {/* Passport Preview */}
      <div className="px-4 my-6">
        <h2 className="text-xl font-bold text-masar-teal mb-3">Your Explorer Passport</h2>
        <div 
          className="bg-masar-gold/20 border-2 border-masar-gold p-5 rounded-xl flex items-center"
          onClick={handlePassportClick}
        >
          <div className="w-16 h-20 bg-masar-teal rounded-lg flex items-center justify-center">
            <Map className="text-white w-8 h-8" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-masar-teal">Emirates Passport</h3>
            <div className="flex items-center mt-1">
              <div className="h-2 bg-gray-200 rounded-full w-full">
                <div 
                  className="h-2 bg-masar-teal rounded-full" 
                  style={{ width: `${(totalCollectedStamps / totalStamps) * 100}%` }} 
                />
              </div>
              <span className="ml-2 text-sm text-masar-teal font-medium">
                {Math.round((totalCollectedStamps / totalStamps) * 100)}%
              </span>
            </div>
          </div>
          <Button 
            className="bg-masar-teal hover:bg-masar-teal/90 text-white ml-2"
            onClick={handlePassportClick}
          >
            View
          </Button>
        </div>
      </div>
      
      {/* Emirates Carousel */}
      <div className="px-4 my-6">
        <h2 className="text-xl font-bold text-masar-teal mb-3">Explore Emirates</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {emitatesData.map((emirate, index) => (
              <Card 
                key={emirate.id} 
                className="flex-shrink-0 w-64 overflow-hidden"
                onClick={() => setActiveEmirateIndex(index)}
              >
                <div className="relative h-36">
                  <img 
                    src={emirate.image} 
                    alt={emirate.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div>
                      <h3 className="text-white font-bold">{emirate.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex space-x-1">
                          {[...Array(emirate.stampCount)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-3 rounded-full ${
                                i < emirate.collectedStamps ? 'bg-masar-gold' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-white">
                          {emirate.collectedStamps}/{emirate.stampCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/passport/${emirate.id}`);
                    }}
                    className="w-full bg-masar-mint hover:bg-masar-mint/90 text-masar-teal"
                  >
                    View Stamps
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scan Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center">
        <Button 
          onClick={handleScanClick}
          className="bg-masar-teal hover:bg-masar-teal/90 text-white px-8 py-6 rounded-full h-auto text-lg font-medium"
        >
          Scan for New Stamp
        </Button>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center text-masar-teal"
            onClick={() => {}}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center"
            onClick={handleScanClick}
          >
            <div className="bg-masar-teal rounded-full p-3 -mt-8 border-4 border-white">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs mt-1">Scan</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center text-gray-400"
            onClick={() => navigate('/profile')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
