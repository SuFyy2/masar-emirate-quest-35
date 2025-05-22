
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const StampEarnedScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDemoScan, setIsDemoScan] = useState(false);
  
  // Extract data from location state
  const { emirateId, stampId, pointsEarned, totalPoints, isDemoScan: isDemo } = 
    location.state || {};
  
  useEffect(() => {
    // Check if this is a demo scan
    if (isDemo) {
      setIsDemoScan(true);
    }
    
    // If no stamp data, redirect to home
    if (!emirateId || !stampId) {
      navigate('/home');
      return;
    }
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Auto-navigate after 5 seconds
    const timer = setTimeout(() => {
      handleContinue();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [emirateId, stampId, navigate, isDemo]);
  
  const handleContinue = () => {
    navigate(`/stamp/${emirateId}/${stampId}`);
  };
  
  const getEmirateName = (id: string) => {
    const emirateMap: Record<string, string> = {
      'abu-dhabi': 'Abu Dhabi',
      'dubai': 'Dubai',
      'sharjah': 'Sharjah',
      'ajman': 'Ajman',
      'umm-al-quwain': 'Umm Al Quwain',
      'fujairah': 'Fujairah',
      'ras-al-khaimah': 'Ras Al Khaimah'
    };
    return emirateMap[id] || 'Unknown Emirate';
  };
  
  const getStampName = (id: string) => {
    // Extract the stamp number if it follows the pattern 'demo-stamp-X'
    if (id.startsWith('demo-stamp-')) {
      const num = id.split('-').pop();
      return `Demo Attraction ${num}`;
    }
    
    // For real stamps, would need a lookup table
    // This is a placeholder
    return `Attraction ${id.split('-').pop()}`;
  };

  return (
    <div className="min-h-screen bg-masar-cream flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-masar-blue">Stamp Collected!</h1>
            <p className="text-gray-600">
              You've added a new stamp to your passport
            </p>
          </div>
          
          <Card className="overflow-hidden mb-6">
            <div className="bg-masar-blue text-white p-4">
              <h2 className="font-bold text-lg">{getEmirateName(emirateId)}</h2>
              <p className="text-sm text-masar-mint">{getStampName(stampId)}</p>
            </div>
            <div className="p-6 flex items-center justify-center">
              <div className="w-32 h-32 bg-masar-mint/20 rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/2ca123d8-3083-4c49-a682-ea763b97b288.png" 
                  alt="Stamp" 
                  className="w-24 h-24 object-contain" 
                />
              </div>
            </div>
            
            {!isDemoScan && (
              <div className="bg-masar-gold/10 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="text-masar-gold w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">You earned</p>
                    <p className="font-bold text-masar-gold text-lg">+{pointsEarned} points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="font-bold">{totalPoints}</p>
                </div>
              </div>
            )}
            
            {isDemoScan && (
              <div className="bg-amber-50 p-4">
                <p className="text-sm text-amber-700">
                  <strong>Demo Mode:</strong> In a real account, you would earn points for this stamp!
                </p>
              </div>
            )}
          </Card>
          
          <Button 
            className="w-full bg-masar-teal hover:bg-masar-teal/90 flex items-center justify-center"
            onClick={handleContinue}
          >
            View Details <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="bg-masar-cream h-24"></div>
    </div>
  );
};

export default StampEarnedScreen;
