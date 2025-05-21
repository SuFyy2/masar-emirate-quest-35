
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Html5Qrcode } from 'html5-qrcode';

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

const ScannerScreen: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize scanner when component mounts
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
    }
    
    // Start scanning if permission is granted
    if (hasPermission === true && scanning) {
      startQRScanner();
    }
    
    // Cleanup scanner when component unmounts
    return () => {
      if (scannerRef.current && scanning) {
        try {
          scannerRef.current.stop();
        } catch (error) {
          console.error("Error stopping scanner:", error);
        }
      }
    };
  }, [hasPermission, scanning]);
  
  // Function to parse QR code data
  const parseQRData = (data: string): any => {
    try {
      // Try to parse as JSON
      return JSON.parse(data);
    } catch (error) {
      // If not valid JSON, return as a string
      return { rawData: data };
    }
  };
  
  // Handle successful scan
  const onScanSuccess = (decodedText: string) => {
    // Stop scanning
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => {
        console.error("Error stopping scanner:", err);
      });
    }
    
    // Parse the QR data
    const stampData = parseQRData(decodedText);
    
    // Ensure the scan has the required information
    if (!stampData.emirateId || !stampData.locationId) {
      toast({
        title: "Invalid QR Code",
        description: "This isn't a valid Masar stamp QR code",
        variant: "destructive"
      });
      
      setTimeout(() => setScanning(true), 2000);
      return;
    }
    
    // Save the collected stamp and add points
    saveCollectedStamp(stampData);
    
    // Show success toast
    toast({
      title: "QR Code detected!",
      description: "Stamp added to your passport"
    });
    
    // Navigate to the stamp earned screen
    navigate('/stamp-earned');
  };
  
  // Handle scan failures
  const onScanFailure = (error: any) => {
    // We can ignore errors since they happen frequently during scanning
  };
  
  // Start the QR scanner
  const startQRScanner = () => {
    if (!scannerRef.current || !scanning) return;
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };
    
    scannerRef.current.start(
      { facingMode: "environment" }, // Use the back camera
      config,
      onScanSuccess,
      onScanFailure
    ).then(() => {
      setHasPermission(true);
    }).catch(err => {
      console.error("Error starting scanner:", err);
      setHasPermission(false);
      
      toast({
        title: "Camera access denied",
        description: "Please grant camera permission to scan QR codes",
        variant: "destructive"
      });
    });
  };
  
  // Request camera permission and start scanning
  const requestCameraPermission = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        // Stop the stream immediately, we just needed permission
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
        
        toast({
          title: "Camera access denied",
          description: "Please grant camera permission to scan QR codes",
          variant: "destructive"
        });
      });
  };
  
  // Request permission when component mounts
  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  const handleCancel = () => {
    // Stop scanner if it's running
    if (scannerRef.current && scanning) {
      scannerRef.current.stop().catch(err => {
        console.error("Error stopping scanner:", err);
      });
    }
    
    setScanning(false);
    navigate(-1);
  };
  
  // Function to save the collected stamp data and award points
  const saveCollectedStamp = (stampData: any) => {
    // Don't save for demo users
    const userName = localStorage.getItem('userName');
    const isDemoUser = userName === 'Demo User';
    
    try {
      // Set user join date if not already set
      if (!localStorage.getItem(getUserStorageKey('userJoinDate'))) {
        const now = new Date();
        const joinDate = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
        localStorage.setItem(getUserStorageKey('userJoinDate'), joinDate);
      }
      
      // Get existing stamps from localStorage
      const existingStampsString = localStorage.getItem(getUserStorageKey('collectedStamps'));
      let collectedStamps: Record<string, any[]> = {};
      
      if (existingStampsString) {
        collectedStamps = JSON.parse(existingStampsString);
      }
      
      // Add the new stamp
      if (!collectedStamps[stampData.emirateId]) {
        collectedStamps[stampData.emirateId] = [];
      }
      
      // Check if this stamp was already collected
      const alreadyCollected = collectedStamps[stampData.emirateId].some(
        stamp => stamp.locationId === stampData.locationId
      );
      
      if (!alreadyCollected) {
        // Add points for collecting a new stamp
        const pointsToAdd = 50; // Base points for each stamp
        
        collectedStamps[stampData.emirateId].push({
          locationId: stampData.locationId,
          name: stampData.name || `Location ${stampData.locationId}`,
          collectedAt: new Date().toISOString(),
          points: pointsToAdd
        });
        
        // Store the current stamp for reference in the earned screen
        localStorage.setItem('currentScannedStamp', JSON.stringify({
          ...stampData,
          points: pointsToAdd
        }));
        
        // Save to localStorage with user-specific key
        localStorage.setItem(getUserStorageKey('collectedStamps'), JSON.stringify(collectedStamps));
        
        // Update the user's total points
        const currentPoints = parseInt(localStorage.getItem(getUserStorageKey('userPoints')) || '0', 10);
        const newTotalPoints = currentPoints + pointsToAdd;
        localStorage.setItem(getUserStorageKey('userPoints'), newTotalPoints.toString());
      }
    } catch (error) {
      console.error("Error saving stamp data:", error);
    }
  };
  
  // For demo purposes, add a way to manually trigger scanning success
  const triggerDemoScan = () => {
    // Create a demo stamp for Dubai Mall
    const demoStampData = {
      emirateId: 'dubai',
      locationId: 2, // Dubai Mall
      name: 'Dubai Mall',
      emirateName: 'Dubai',
      description: 'Home to over 1,200 retail outlets and 200 food & beverage outlets, Dubai Mall is one of the world\'s largest shopping destinations.',
      icon: '🛍️',
      timestamp: new Date().toISOString()
    };
    
    // Save the stamp data and navigate
    saveCollectedStamp(demoStampData);
    
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
        {hasPermission === false && (
          <div className="text-center text-white mb-8">
            <p className="mb-4">Camera access is required to scan QR codes.</p>
            <Button 
              onClick={requestCameraPermission}
              className="bg-masar-teal hover:bg-masar-teal/90 text-white"
            >
              Grant Camera Permission
            </Button>
          </div>
        )}
        
        {hasPermission !== false && (
          <>
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* QR Scanner viewport */}
              <div id={scannerContainerId} className="w-full h-full"></div>
              
              {/* Scanner frame UI */}
              <div className="absolute inset-0 border-2 border-masar-teal rounded-lg overflow-hidden pointer-events-none">
                {scanning && (
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 bg-masar-mint"
                    style={{
                      animation: 'scanAnimation 2s linear infinite',
                    }}
                  />
                )}
              </div>
              
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-masar-teal pointer-events-none" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-masar-teal pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-masar-teal pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-masar-teal pointer-events-none" />
            </div>
            
            <h2 className="text-white text-center text-xl font-bold mb-2">
              Scan QR Code
            </h2>
            <p className="text-white/70 text-center mb-8">
              Position the QR code within the frame to scan
            </p>
          </>
        )}
        
        {/* Demo button - normally wouldn't be in production app */}
        <Button 
          onClick={triggerDemoScan}
          className="bg-masar-teal/50 hover:bg-masar-teal/70 text-white"
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
      
      <style>
        {`
          @keyframes scanAnimation {
            0% { transform: translateY(0); }
            50% { transform: translateY(256px); }
            100% { transform: translateY(0); }
          }
          
          #${scannerContainerId} video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
            border-radius: 0.5rem;
          }
          
          #${scannerContainerId} canvas {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default ScannerScreen;
