
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Map, 
  Compass, 
  User, 
  Gift, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string): string => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return key; // Fallback
  return `${currentUserEmail}_${key}`;
};

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  platform: string;
  discount: string;
  image: string;
}

const availableRewards: Reward[] = [
  {
    id: 'noon-discount',
    name: 'noon.com Discount',
    description: '15% off on your next purchase',
    pointsCost: 100,
    platform: 'noon.com',
    discount: '15% OFF',
    image: '/lovable-uploads/61478542-9eea-4ce7-97df-c4378c6f5b2b.png'
  },
  {
    id: 'talabat-discount',
    name: 'Talabat Voucher',
    description: '20 AED off on your next order',
    pointsCost: 150,
    platform: 'Talabat',
    discount: '20 AED OFF',
    image: '/lovable-uploads/f67ad689-c41a-4709-81e5-891e2d2d17fa.png'
  },
  {
    id: 'smile-discount',
    name: 'Smiles App Points',
    description: 'Get 500 Smiles points',
    pointsCost: 200,
    platform: 'Smiles App',
    discount: '500 POINTS',
    image: '/lovable-uploads/5a1c75e7-d0cd-4996-8dea-ccb1105c9ebf.png'
  }
];

interface RedeemedReward extends Reward {
  redeemedAt: string;
  expiresAt: string;
  voucherCode: string;
  isUsed: boolean;
}

const RewardsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [activeVoucher, setActiveVoucher] = useState<RedeemedReward | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      // Redirect to auth screen if not authenticated
      navigate('/auth');
      return;
    }

    // Load user points
    const storedPoints = localStorage.getItem(getUserStorageKey('userPoints')) || '0';
    setUserPoints(parseInt(storedPoints, 10));

    // Load redeemed rewards
    const storedRewards = localStorage.getItem(getUserStorageKey('redeemedRewards'));
    if (storedRewards) {
      try {
        const parsedRewards = JSON.parse(storedRewards) as RedeemedReward[];
        setRedeemedRewards(parsedRewards);

        // Check for active vouchers (not used and not expired)
        const now = new Date();
        const active = parsedRewards.find(reward => 
          !reward.isUsed && new Date(reward.expiresAt) > now
        );
        
        if (active) {
          setActiveVoucher(active);
          const secondsRemaining = Math.floor((new Date(active.expiresAt).getTime() - now.getTime()) / 1000);
          setRemainingSeconds(secondsRemaining > 0 ? secondsRemaining : 0);
        }
      } catch (error) {
        console.error('Failed to parse redeemed rewards:', error);
      }
    }
  }, [navigate]);

  // Timer for active voucher
  useEffect(() => {
    let timerId: number | undefined;
    
    if (activeVoucher && remainingSeconds > 0) {
      timerId = window.setInterval(() => {
        setRemainingSeconds(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            // Mark voucher as expired
            handleVoucherExpired();
            clearInterval(timerId);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activeVoucher, remainingSeconds]);

  const handleVoucherExpired = () => {
    if (!activeVoucher) return;

    // Mark the voucher as used
    const updatedRewards = redeemedRewards.map(reward => 
      reward.id === activeVoucher.id 
        ? { ...reward, isUsed: true } 
        : reward
    );

    // Update localStorage
    localStorage.setItem(getUserStorageKey('redeemedRewards'), JSON.stringify(updatedRewards));
    setRedeemedRewards(updatedRewards);
    setActiveVoucher(null);

    toast({
      title: "Voucher Expired",
      description: "Your voucher has expired and is no longer valid.",
      variant: "destructive"
    });
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsDialogOpen(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;

    // Check if user has enough points
    if (userPoints < selectedReward.pointsCost) {
      toast({
        title: "Not Enough Points",
        description: `You need ${selectedReward.pointsCost - userPoints} more points to redeem this reward.`,
        variant: "destructive"
      });
      setIsDialogOpen(false);
      return;
    }

    // Check if there's already an active voucher
    if (activeVoucher) {
      toast({
        title: "Active Voucher",
        description: "You already have an active voucher. Please use it before redeeming another one.",
        variant: "destructive"
      });
      setIsDialogOpen(false);
      return;
    }

    // Generate a random voucher code
    const voucherCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Set expiry time (60 minutes from now)
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 60 * 60 * 1000); // 60 minutes

    // Create redeemed reward object
    const redeemedReward: RedeemedReward = {
      ...selectedReward,
      redeemedAt: now.toISOString(),
      expiresAt: expiryTime.toISOString(),
      voucherCode,
      isUsed: false
    };

    // Deduct points from user
    const newPoints = userPoints - selectedReward.pointsCost;
    setUserPoints(newPoints);
    localStorage.setItem(getUserStorageKey('userPoints'), newPoints.toString());

    // Add to redeemed rewards
    const updatedRewards = [...redeemedRewards, redeemedReward];
    setRedeemedRewards(updatedRewards);
    setActiveVoucher(redeemedReward);
    setRemainingSeconds(60 * 60); // 60 minutes in seconds
    localStorage.setItem(getUserStorageKey('redeemedRewards'), JSON.stringify(updatedRewards));

    // Close dialog and show success message
    setIsDialogOpen(false);
    
    toast({
      title: "Reward Redeemed!",
      description: `You've successfully redeemed ${selectedReward.name}. You have 60 minutes to use it.`
    });
    
    // Show the QR code
    setQrDialogOpen(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUseVoucher = () => {
    if (activeVoucher) {
      setQrDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="text-white p-4 bg-masar-blue">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white p-2 h-auto" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Rewards</h1>
          </div>
          <div className="flex items-center">
            <Gift className="w-5 h-5 mr-1" />
            <span className="font-bold">{userPoints} Points</span>
          </div>
        </div>
      </div>

      {/* Active Voucher - Show only if there's an active voucher */}
      {activeVoucher && (
        <div className="p-4">
          <Card className="p-4 bg-masar-gold/10 border-masar-gold">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-masar-gold">Active Voucher</h3>
              <div className="flex items-center bg-masar-gold text-white px-2 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{formatTime(remainingSeconds)}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 p-2 flex items-center justify-center">
                <img 
                  src={activeVoucher.image} 
                  alt={activeVoucher.platform} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-medium">{activeVoucher.name}</h4>
                <p className="text-sm text-gray-600">{activeVoucher.discount} on {activeVoucher.platform}</p>
                <p className="text-xs mt-1 text-masar-teal">
                  Voucher code: {activeVoucher.voucherCode}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-masar-gold text-masar-gold" 
                onClick={handleUseVoucher}
              >
                Use Now
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Available Rewards */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-masar-blue">Available Rewards</h2>
        <div className="space-y-4">
          {availableRewards.map((reward) => (
            <Card key={reward.id} className="p-4 flex items-center">
              <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 p-2 flex items-center justify-center">
                <img 
                  src={reward.image} 
                  alt={reward.platform} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bold">{reward.name}</h3>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <div className="flex items-center mt-1">
                  <Gift className="w-4 h-4 text-masar-teal mr-1" />
                  <span className="text-sm font-medium text-masar-teal">{reward.pointsCost} points</span>
                </div>
              </div>
              <Button 
                variant="default" 
                className="bg-masar-teal hover:bg-masar-teal/90"
                onClick={() => handleRedeemClick(reward)}
                disabled={userPoints < reward.pointsCost || !!activeVoucher}
              >
                Redeem
              </Button>
            </Card>
          ))}
        </div>

        {/* History of Redeemed Rewards */}
        {redeemedRewards.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-masar-blue">Redemption History</h2>
            <div className="space-y-3">
              {redeemedRewards
                .filter(r => r.isUsed || new Date(r.expiresAt) < new Date())
                .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
                .map((reward) => (
                  <Card key={reward.redeemedAt} className="p-3 flex items-center bg-gray-50">
                    <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 p-1 flex items-center justify-center">
                      <img 
                        src={reward.image} 
                        alt={reward.platform} 
                        className="max-w-full max-h-full object-contain opacity-60" 
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm">{reward.name}</h4>
                      <p className="text-xs text-gray-500">
                        Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-600">
                      Used
                    </span>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
          </DialogHeader>
          
          {selectedReward && (
            <>
              <div className="py-4">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 p-2 mr-4 border flex items-center justify-center">
                    <img 
                      src={selectedReward.image} 
                      alt={selectedReward.platform} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedReward.name}</h3>
                    <p className="text-sm">{selectedReward.description}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Your points:</span>
                    <span className="font-medium">{userPoints} points</span>
                  </div>
                  <div className="flex justify-between text-masar-red">
                    <span className="text-sm">Cost:</span>
                    <span className="font-medium">-{selectedReward.pointsCost} points</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Remaining:</span>
                    <span>{userPoints - selectedReward.pointsCost} points</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  This voucher will be active for 60 minutes after redemption. After that, it will expire.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={confirmRedeem} className="bg-masar-teal hover:bg-masar-teal/90">
                  Redeem Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan to Redeem</DialogTitle>
          </DialogHeader>
          
          {activeVoucher && (
            <div className="py-4 flex flex-col items-center">
              <div className="mb-4 w-48 h-48 bg-white p-3 border-2 border-masar-teal rounded-lg flex items-center justify-center relative">
                {/* This represents a QR code - would typically use a QR code library here */}
                <div className="w-full h-full bg-white flex items-center justify-center border-4 border-masar-gold relative">
                  <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                        } ${
                          (i < 5 && i % 4 === 0) || 
                          (i > 19 && i % 4 === 0) || 
                          (i % 5 === 0 && i % 4 === 0) ? 
                          'bg-masar-teal' : ''
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="z-10 w-1/3 h-1/3 bg-white flex items-center justify-center rounded-lg">
                    <img 
                      src={activeVoucher.image} 
                      alt={activeVoucher.platform} 
                      className="w-4/5 h-4/5 object-contain" 
                    />
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-1">{activeVoucher.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{activeVoucher.discount}</p>
              
              <div className="bg-gray-50 p-3 rounded-lg w-full flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Code: {activeVoucher.voucherCode}</span>
                <div className="flex items-center text-masar-red">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{formatTime(remainingSeconds)}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 text-center">
                Present this code to the cashier or scan at the checkout
              </div>
              
              <Button 
                variant="outline" 
                className="mt-4 w-full flex items-center justify-center border-masar-teal text-masar-teal"
                onClick={() => window.open('https://' + activeVoucher.platform.toLowerCase(), '_blank')}
              >
                Visit {activeVoucher.platform} <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/home')}>
            <Map className="w-6 h-6" />
            <span className="text-xs mt-1">Explore</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-gray-400" onClick={() => navigate('/scan')}>
            <div className="bg-gray-200 rounded-full p-3 -mt-8 border-4 border-white">
              <Compass className="w-6 h-6 text-gray-500" />
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

export default RewardsScreen;
