
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from 'lucide-react';

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
  const { emirateId } = useParams();
  const navigate = useNavigate();
  
  const emirateData = emirateId 
    ? emitatesData.find(emirate => emirate.id === emirateId)
    : emitatesData[0]; // Default to Abu Dhabi if no emirate specified
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleScanClick = () => {
    navigate('/scan');
  };
  
  const handleStampClick = (locationId: number) => {
    // In a real app, you would navigate to a stamp detail page
    const location = emirateData?.locations.find(l => l.id === locationId);
    if (location?.collected) {
      navigate(`/stamp/${emirateData?.id}/${locationId}`);
    }
  };

  if (!emirateData) {
    return <div>Emirate not found</div>;
  }

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="bg-masar-teal text-white p-4">
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
      
      {/* Emirate Selector if no emirate specified */}
      {!emirateId && (
        <div className="p-4">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {emitatesData.map((emirate) => (
              <Button 
                key={emirate.id}
                variant={emirate.id === (emirateData?.id || 'abu-dhabi') ? "default" : "outline"}
                className={emirate.id === (emirateData?.id || 'abu-dhabi') ? 
                  "bg-masar-teal text-white" : 
                  "border-masar-teal text-masar-teal"
                }
                onClick={() => navigate(`/passport/${emirate.id}`)}
              >
                {emirate.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Passport Book */}
      <div className="px-4 py-8">
        <div 
          className={`flip-card mx-auto max-w-md aspect-[3/4] ${isFlipped ? 'flip-active' : ''}`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner w-full h-full">
            {/* Front Page */}
            <div className="flip-card-front w-full h-full bg-masar-gold rounded-2xl p-5 shadow-lg">
              <div className="bg-masar-cream rounded-lg w-full h-full flex flex-col justify-between p-4">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
                    alt="Masar Logo" 
                    className="h-12"
                  />
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-bold text-masar-teal">{emirateData.name}</h2>
                  <p className="text-sm text-masar-teal/80">Tap to view stamps</p>
                </div>
                
                <div className="relative h-1/2 mt-4 overflow-hidden rounded-lg">
                  <img 
                    src={emirateData.image}
                    alt={emirateData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-masar-teal/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <p className="font-medium">Explore {emirateData.name}</p>
                      </div>
                      <p className="text-sm mt-1">
                        {emirateData.locations.filter(loc => loc.collected).length}/{emirateData.locations.length} Stamps Collected
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-xs text-masar-teal/60 mt-4">
                  Tap card to flip and view stamps
                </p>
              </div>
            </div>
            
            {/* Back Page (Stamps) */}
            <div className="flip-card-back w-full h-full bg-masar-cream rounded-2xl p-5 shadow-lg">
              <div className="bg-masar-mint/20 rounded-lg w-full h-full flex flex-col p-4">
                <h2 className="text-lg font-bold text-masar-teal text-center mb-4">
                  {emirateData.name} Stamps
                </h2>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {emirateData.locations.map((location) => (
                    <div 
                      key={location.id}
                      className={`rounded-lg p-3 flex flex-col items-center justify-center text-center ${
                        location.collected ? 'bg-masar-mint/40' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStampClick(location.id)}
                    >
                      {location.collected ? (
                        <div className="w-12 h-12 bg-masar-teal rounded-full flex items-center justify-center mb-2">
                          <span className="text-white text-xl">✓</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                          <span className="text-gray-400 text-xl">?</span>
                        </div>
                      )}
                      <p className={`text-sm font-medium ${location.collected ? 'text-masar-teal' : 'text-gray-400'}`}>
                        {location.name}
                      </p>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-xs text-masar-teal/60 mt-4">
                  Tap card to flip back
                </p>
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
