
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Camera } from 'lucide-react';

const emitatesData = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Sheikh Zayed Grand Mosque', collected: true },
      { id: 2, name: 'Louvre Abu Dhabi', collected: true },
      { id: 3, name: 'Ferrari World', collected: false },
      { id: 4, name: 'Qasr Al Watan', collected: false },
      { id: 5, name: 'Yas Marina Circuit', collected: false },
    ]
  },
  {
    id: 'dubai',
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Burj Khalifa', collected: true },
      { id: 2, name: 'Dubai Mall', collected: true },
      { id: 3, name: 'Palm Jumeirah', collected: true },
      { id: 4, name: 'Dubai Creek', collected: false },
      { id: 5, name: 'Dubai Museum', collected: false },
    ]
  },
  {
    id: 'sharjah',
    name: 'Sharjah',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Al Noor Island', collected: false },
      { id: 2, name: 'Sharjah Museum of Islamic Civilization', collected: false },
      { id: 3, name: 'Al Qasba Canal', collected: false },
      { id: 4, name: 'Rain Room Sharjah', collected: false },
      { id: 5, name: 'Sharjah Art Museum', collected: false },
    ]
  },
  {
    id: 'ajman',
    name: 'Ajman',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Ajman Museum', collected: true },
      { id: 2, name: 'Ajman Corniche', collected: false },
      { id: 3, name: 'Al Zorah Nature Reserve', collected: false },
      { id: 4, name: 'Ajman Marina', collected: false },
      { id: 5, name: 'Masfout Mountains', collected: false },
    ]
  },
  {
    id: 'umm-al-quwain',
    name: 'Umm Al Quwain',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'UAQ Museum', collected: false },
      { id: 2, name: 'Dreamland Aqua Park', collected: false },
      { id: 3, name: 'Al Sinniyah Island', collected: false },
      { id: 4, name: 'UAQ Marine Club', collected: false },
      { id: 5, name: 'Ed Dasoodi Wildlife Sanctuary', collected: false },
    ]
  },
  {
    id: 'fujairah',
    name: 'Fujairah',
    image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Al Bidyah Mosque', collected: false },
      { id: 2, name: 'Fujairah Fort', collected: false },
      { id: 3, name: 'Snoopy Island', collected: false },
      { id: 4, name: 'Wadi Wurayah', collected: false },
      { id: 5, name: 'Ain Al Madhab Gardens', collected: false },
    ]
  },
  {
    id: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    image: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=800&q=80',
    locations: [
      { id: 1, name: 'Jebel Jais', collected: false },
      { id: 2, name: 'RAK National Museum', collected: false },
      { id: 3, name: 'Al Jazirah Al Hamra', collected: false },
      { id: 4, name: 'Dhayah Fort', collected: false },
      { id: 5, name: 'Iceland Water Park', collected: false },
    ]
  }
];

const PassportScreen = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeEmirateId, setActiveEmirateId] = useState('abu-dhabi');
  const { emirateId } = useParams();
  const navigate = useNavigate();
  
  // Set the active emirate based on the URL param or default
  React.useEffect(() => {
    if (emirateId) {
      setActiveEmirateId(emirateId);
    }
  }, [emirateId]);
  
  const emirateData = emitatesData.find(emirate => emirate.id === activeEmirateId) || emitatesData[0];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleScanClick = () => {
    navigate('/scan');
  };
  
  const handleStampClick = (locationId) => {
    const location = emirateData?.locations.find(l => l.id === locationId);
    if (location?.collected) {
      navigate(`/stamp/${emirateData?.id}/${locationId}`);
    }
  };

  const handleAddMemory = (locationId) => {
    // In a real app, this would navigate to an add memory screen with the specific location
    navigate(`/stamp-earned`);
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-gold text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="text-white p-2 h-auto" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Digital Passport</h1>
        </div>
      </div>
      
      {/* Passport Book */}
      <div className="px-4 py-8">
        <div 
          className={`flip-card mx-auto max-w-md aspect-[3/4] ${isFlipped ? 'flip-active' : ''}`}
        >
          <div className="flip-card-inner w-full h-full" onClick={handleFlip}>
            {/* Front Cover - UAE Passport Style */}
            <div className="flip-card-front w-full h-full bg-masar-gold rounded-2xl shadow-lg">
              <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-8 w-full flex justify-center">
                  <img 
                    src="/lovable-uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
                    alt="Masar Logo" 
                    className="w-32 h-auto"
                  />
                </div>
                
                <div className="text-center mt-24">
                  <h2 className="text-white text-3xl font-bold tracking-wider mb-2">MASAR</h2>
                  <p className="text-white/90 text-lg mb-8">United Arab Emirates</p>
                  <p className="text-white/80 text-sm">Digital Explorer Passport</p>
                </div>
                
                <div className="absolute bottom-8 w-full flex justify-center">
                  <p className="text-white/70 text-xs">Tap to open</p>
                </div>
              </div>
            </div>
            
            {/* Inside Pages */}
            <div className="flip-card-back w-full h-full flex bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Left Page - Emirates Navigation */}
              <div className="w-1/3 h-full bg-masar-cream/30 border-r border-masar-gold/20 p-3">
                <h3 className="text-center text-sm font-bold text-masar-teal mb-4">Emirates</h3>
                <div className="space-y-2">
                  {emitatesData.map((emirate) => (
                    <Button 
                      key={emirate.id}
                      variant="ghost" 
                      className={`w-full justify-start text-xs py-2 ${
                        emirate.id === activeEmirateId 
                          ? 'bg-masar-gold/20 text-masar-teal font-medium' 
                          : 'text-masar-teal/70'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEmirateId(emirate.id);
                      }}
                    >
                      {emirate.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Right Page - Stamps */}
              <div className="w-2/3 h-full bg-white p-3 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-masar-teal">{emirateData.name}</h2>
                  <p className="text-xs text-masar-teal/60">
                    {emirateData.locations.filter(l => l.collected).length}/{emirateData.locations.length} Stamps
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {emirateData.locations.map((location) => (
                    <div 
                      key={location.id}
                      className={`rounded-lg p-3 ${
                        location.collected ? 'bg-masar-mint/20' : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                            location.collected ? 'bg-masar-teal' : 'bg-gray-200'
                          }`}
                          onClick={() => handleStampClick(location.id)}
                        >
                          {location.collected ? (
                            <span className="text-white text-xl">✓</span>
                          ) : (
                            <span className="text-gray-400 text-xl">?</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`font-medium ${location.collected ? 'text-masar-teal' : 'text-gray-400'}`}>
                            {location.name}
                          </p>
                          
                          {location.collected && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-masar-teal mt-1 p-0 h-auto flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddMemory(location.id);
                              }}
                            >
                              <Camera className="h-3 w-3 mr-1" /> Add Memory
                            </Button>
                          )}
                        </div>
                        
                        {location.collected && (
                          <Button
                            size="sm"
                            className="bg-masar-teal text-white h-8 ml-2"
                            onClick={() => handleStampClick(location.id)}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scan Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center">
        <Button 
          onClick={handleScanClick}
          className="bg-masar-teal hover:bg-masar-teal/90 text-white px-8 py-4 rounded-full h-auto"
        >
          Scan for New Stamp
        </Button>
      </div>
    </div>
  );
};

export default PassportScreen;
