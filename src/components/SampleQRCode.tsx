
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample stamp data objects for different locations
const sampleStampData = [
  {
    emirateId: 'dubai',
    locationId: 2,
    name: 'Dubai Mall',
    emirateName: 'Dubai',
    description: 'Home to over 1,200 retail outlets and 200 food & beverage outlets, Dubai Mall is one of the world\'s largest shopping destinations.',
    icon: '🛍️',
  },
  {
    emirateId: 'abu-dhabi',
    locationId: 1,
    name: 'Sheikh Zayed Grand Mosque',
    emirateName: 'Abu Dhabi',
    description: 'One of the world\'s largest mosques and an architectural masterpiece.',
    icon: '🕌',
  },
  {
    emirateId: 'sharjah',
    locationId: 1,
    name: 'Sharjah Museum of Islamic Civilization',
    emirateName: 'Sharjah',
    description: 'Houses more than 5,000 artifacts from the Islamic world.',
    icon: '🏛️',
  }
];

const SampleQRCode = () => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Generate QR codes for each sample data
    sampleStampData.forEach((stampData, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas) {
        // Convert the object to a JSON string
        const jsonString = JSON.stringify(stampData);
        
        // Generate QR code
        QRCode.toCanvas(canvas, jsonString, {
          width: 200,
          margin: 2,
          color: {
            dark: '#0D9B8A', // Masar teal color for dark modules
            light: '#ffffff' // White color for light modules
          }
        }, (error) => {
          if (error) console.error('Error generating QR code:', error);
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-masar-cream flex flex-col">
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
          <h1 className="text-xl font-bold ml-2">Sample QR Codes</h1>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <p className="text-masar-blue mb-6">
          Use these QR codes to simulate scanning stamps at different locations. 
          Point your camera at one of these QR codes from the scan screen to collect the stamp.
        </p>
        
        {sampleStampData.map((stamp, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold text-masar-teal mb-2">{stamp.name}</h2>
            <p className="text-sm text-masar-blue/80 mb-4">{stamp.emirateName} - {stamp.description}</p>
            
            <div className="flex justify-center mb-4">
              <canvas 
                ref={el => canvasRefs.current[index] = el} 
                className="border-2 border-masar-teal/20 rounded-lg"
              />
            </div>
            
            <div className="text-xs text-masar-blue/60 text-center">
              Scan this code in the scanner screen to collect this stamp
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SampleQRCode;
