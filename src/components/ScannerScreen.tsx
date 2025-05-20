
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ScannerScreen = () => {
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // For demo purposes, simulate QR scanning after a few seconds
    const timer = setTimeout(() => {
      if (scanning) {
        // Success: Navigate to stamp earned screen
        navigate('/stamp-earned');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [scanning, navigate]);
  
  const handleCancel = () => {
    setScanning(false);
    navigate(-1);
  };
  
  // For demo purposes, add a way to manually trigger scanning success
  const triggerSuccess = () => {
    toast({
      title: "QR Code detected!",
    });
    navigate('/stamp-earned');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          className="text-white p-2 h-auto" 
          onClick={handleCancel}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Scanner UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Scanning animation */}
          <div className="absolute inset-0 border-2 border-masar-teal rounded-lg overflow-hidden">
            {scanning && (
              <div 
                className="absolute top-0 left-0 right-0 h-1 bg-masar-mint"
                style={{
                  animation: 'scanAnimation 2s linear infinite',
                }}
              />
            )}
          </div>
          
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-masar-teal" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-masar-teal" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-masar-teal" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-masar-teal" />
        </div>
        
        <h2 className="text-white text-center text-xl font-bold mb-2">
          Scan QR Code
        </h2>
        <p className="text-white/70 text-center mb-8">
          Position the QR code within the frame to scan
        </p>
        
        {/* Demo buttons - normally wouldn't be in production app */}
        <Button 
          onClick={triggerSuccess}
          className="bg-masar-teal hover:bg-masar-teal/90 text-white"
        >
          Demo: Simulate Successful Scan
        </Button>
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-black">
        <Button 
          variant="outline" 
          className="w-full border-white text-white"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
      
      <style jsx>{`
        @keyframes scanAnimation {
          0% { transform: translateY(0); }
          50% { transform: translateY(256px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ScannerScreen;
