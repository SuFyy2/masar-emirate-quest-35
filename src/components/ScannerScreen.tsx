
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Map, Compass, User, Gift, X, Camera, ScanLine } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useToast } from "@/hooks/use-toast";

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

const ScannerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "html5-qrcode-scanner";

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Check if user is a demo user
    const userName = localStorage.getItem('userName');
    setIsDemoUser(userName === 'Demo User');

    // Clean up scanner on component unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error('Error stopping scanner:', error);
        });
      }
    };
  }, [navigate]);

  const startScanner = () => {
    if (isDemoUser) {
      toast({
        title: "Demo Mode",
        description: "Camera access is restricted in demo mode. Try the demo scan instead.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First ensure we don't have a scanning session already active
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      
      // Reset isScanning to create fresh UI state
      setIsScanning(true);
      
      // Add a small delay to ensure DOM elements are created before scanner init
      setTimeout(() => {
        // Check if scanner container exists after the state update
        const scannerContainer = document.getElementById(scannerContainerId);
        if (!scannerContainer) {
          console.error('Scanner container not found after delay');
          toast({
            title: "Scanner Error",
            description: "Scanner container not found. Please try again.",
            variant: "destructive"
          });
          setIsScanning(false);
          return;
        }

        // Initialize scanner
        try {
          console.log("Initializing scanner...");
          const html5QrCode = new Html5Qrcode(scannerContainerId);
          scannerRef.current = html5QrCode;

          // Show a toast to indicate that permissions might be requested
          toast({
            title: "Camera Access",
            description: "Please allow camera access when prompted",
          });

          const qrConfig = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1
          };

          console.log("Starting scanner...");
          // Start the scanner with explicit camera access request
          html5QrCode.start(
            { facingMode: "environment" },
            qrConfig,
            (decodedText) => {
              // Successfully scanned QR code
              console.log(`Code scanned: ${decodedText}`);
              handleQRCodeScanned(decodedText);
              stopScanner();
            },
            (errorMessage) => {
              // Error scanning QR code - this is normal during scanning, don't show toasts here
              console.log(`QR Code scanning in progress: ${errorMessage}`);
            }
          ).catch(err => {
            console.error("Error starting scanner:", err);
            toast({
              title: "Camera Error",
              description: "Could not access your camera. Please check permissions.",
              variant: "destructive"
            });
            setIsScanning(false); // Ensure button is reset if scan fails to start
          });
        } catch (error) {
          console.error("Error initializing scanner:", error);
          toast({
            title: "Scanner Error",
            description: "Failed to initialize the scanner. Please try again.",
            variant: "destructive"
          });
          setIsScanning(false);
        }
      }, 300); // Short delay to ensure DOM is ready
    } catch (error) {
      console.error("Error in startScanner:", error);
      toast({
        title: "Scanner Error",
        description: "Failed to start the scanner. Please try again.",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    console.log("Stopping scanner...");
    if (scannerRef.current) {
      if (scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          console.log('Scanner stopped');
          setIsScanning(false);
        }).catch(err => {
          console.error("Error stopping scanner:", err);
          setIsScanning(false); // Ensure button is reset even if there's an error
        });
      } else {
        setIsScanning(false); // If not scanning, just reset the state
      }
    } else {
      setIsScanning(false); // Fallback in case scanner reference isn't valid
    }
  };

  const handleQRCodeScanned = (scannedData: string) => {
    try {
      // Try to parse the scanned data as JSON
      const stampData = JSON.parse(scannedData);
      
      if (stampData.type === 'masar-stamp' && stampData.emirateId && stampData.stampId) {
        // Process the stamp data
        processStampData(stampData);
      } else {
        toast({
          title: "Invalid QR Code",
          description: "This QR code is not a valid Masar stamp.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code Format",
        description: "Could not read the QR code data.",
        variant: "destructive"
      });
      console.error('Error parsing QR code data:', error);
    }
  };

  const processStampData = (stampData: { emirateId: string, stampId: string, type: string }) => {
    // For demo users, don't save any progress
    if (isDemoUser) {
      navigate('/stamp-earned', { 
        state: { 
          emirateId: stampData.emirateId,
          stampId: stampData.stampId,
          pointsEarned: 10,
          totalPoints: 10,
          isDemoScan: true
        } 
      });
      return;
    }
    
    // Load existing collected stamps from localStorage
    const existingStampsJson = localStorage.getItem(getUserStorageKey('collectedStamps')) || '{}';
    let collectedStamps;
    
    try {
      collectedStamps = JSON.parse(existingStampsJson);
    } catch (error) {
      console.error('Error parsing stored stamps:', error);
      collectedStamps = {};
    }
    
    // Check if this emirate exists in collected stamps
    if (!collectedStamps[stampData.emirateId]) {
      collectedStamps[stampData.emirateId] = [];
    }
    
    // Check if this stamp is already collected
    const isAlreadyCollected = collectedStamps[stampData.emirateId].includes(stampData.stampId);
    
    if (isAlreadyCollected) {
      toast({
        title: "Already Collected",
        description: "You've already collected this stamp!",
        variant: "default"
      });
      return;
    }
    
    // Add the new stamp
    collectedStamps[stampData.emirateId].push(stampData.stampId);
    
    // Save updated stamps
    localStorage.setItem(getUserStorageKey('collectedStamps'), JSON.stringify(collectedStamps));
    
    // Award points to the user (10 points per stamp)
    const currentPoints = parseInt(localStorage.getItem(getUserStorageKey('userPoints')) || '0', 10);
    const newPoints = currentPoints + 10;
    localStorage.setItem(getUserStorageKey('userPoints'), newPoints.toString());
    
    // Navigate to stamp earned screen
    navigate('/stamp-earned', { 
      state: { 
        emirateId: stampData.emirateId,
        stampId: stampData.stampId,
        pointsEarned: 10,
        totalPoints: newPoints
      } 
    });
  };

  const handleDemoScan = () => {
    // Generate a random emirate and stamp ID for demo purposes
    const emirates = ['abu-dhabi', 'dubai', 'sharjah', 'ajman', 'umm-al-quwain', 'fujairah', 'ras-al-khaimah'];
    const randomEmirateIndex = Math.floor(Math.random() * emirates.length);
    const randomEmirateId = emirates[randomEmirateIndex];
    const randomStampId = `demo-stamp-${Math.floor(Math.random() * 5) + 1}`;
    
    const demoStampData = {
      type: 'masar-stamp',
      emirateId: randomEmirateId,
      stampId: randomStampId
    };
    
    // Always show demo scan but never update progress
    toast({
      title: "Demo Scan",
      description: "This is a demo scan. No points or progress will be saved.",
    });
    
    navigate('/stamp-earned', { 
      state: { 
        emirateId: demoStampData.emirateId,
        stampId: demoStampData.stampId,
        pointsEarned: 10,
        totalPoints: 10,
        isDemoScan: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="text-white p-4 bg-masar-blue">
        <div className="flex items-center">
          <Button variant="ghost" className="text-white p-2 h-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">Scan QR Code</h1>
        </div>
      </div>

      {/* Scanner Area */}
      <div className="p-4 flex flex-col items-center">
        <div className="w-full max-w-sm mb-4">
          <Card className={`w-full aspect-square relative ${isScanning ? 'border-2 border-masar-teal' : 'bg-gray-100'}`}>
            {isScanning ? (
              <>
                {/* This is the container that will be used by the QR scanner */}
                <div id={scannerContainerId} className="w-full h-full"></div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2 z-10 bg-white"
                  onClick={stopScanner}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <ScanLine className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-center text-gray-500 mb-4">
                  {isDemoUser 
                    ? "Camera access is restricted in demo mode. Try the demo scan instead."
                    : "Position the QR code in the scanner to collect your stamp"}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Button 
            className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white"
            onClick={startScanner}
            disabled={isScanning || isDemoUser}
          >
            {isScanning ? 'Scanning...' : 'Start Scanner'}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-masar-cream text-gray-500">OR</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-masar-teal text-masar-teal"
            onClick={handleDemoScan}
          >
            Try Demo Scan
          </Button>
        </div>
        
        <div className="mt-8 text-center px-4">
          <h3 className="font-medium text-masar-blue mb-2">How to scan?</h3>
          <p className="text-sm text-gray-600">
            Visit an attraction in the UAE and look for Masar QR codes. 
            Scan them to collect stamps and earn points for your passport!
          </p>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/home')}>
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-masar-teal" onClick={() => {}}>
            <div className="bg-masar-teal rounded-full p-3 -mt-8 border-4 border-white">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs mt-1">Scan</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/rewards')}>
            <Gift className="w-6 h-6" />
            <span className="text-xs mt-1">Rewards</span>
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

export default ScannerScreen;
