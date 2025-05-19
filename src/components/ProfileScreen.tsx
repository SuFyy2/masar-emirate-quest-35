import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Map, Compass, Star } from 'lucide-react';

const emitatesData = [{
  id: 'abu-dhabi',
  name: 'Abu Dhabi',
  collected: 2,
  total: 5
}, {
  id: 'dubai',
  name: 'Dubai',
  collected: 3,
  total: 5
}, {
  id: 'sharjah',
  name: 'Sharjah',
  collected: 0,
  total: 5
}, {
  id: 'ajman',
  name: 'Ajman',
  collected: 1,
  total: 5
}, {
  id: 'umm-al-quwain',
  name: 'Umm Al Quwain',
  collected: 0,
  total: 5
}, {
  id: 'fujairah',
  name: 'Fujairah',
  collected: 0,
  total: 5
}, {
  id: 'ras-al-khaimah',
  name: 'Ras Al Khaimah',
  collected: 0,
  total: 5
}];

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Explorer');
  
  useEffect(() => {
    // Get the current username from localStorage whenever component mounts
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const totalCollected = emitatesData.reduce((sum, emirate) => sum + emirate.collected, 0);
  const totalStamps = emitatesData.reduce((sum, emirate) => sum + emirate.total, 0);
  const completionPercentage = Math.round(totalCollected / totalStamps * 100);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-masar-cream pb-20">
      {/* Header */}
      <div className="text-white p-4 bg-masar-blue">
        <div className="flex items-center">
          <Button variant="ghost" className="text-white p-2 h-auto" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold ml-2">My Profile</h1>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-masar-mint rounded-full flex items-center justify-center mr-4">
            <User className="w-10 h-10 text-masar-teal" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-masar-gold">{userName}</h2>
            <p className="text-masar-red">
              {completionPercentage}% Explorer
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-masar-mint/30">
            <div className="flex items-center mb-2">
              <Map className="w-5 h-5 text-masar-teal mr-2" />
              <h3 className="font-medium text-masar-teal">Total Stamps</h3>
            </div>
            <p className="text-2xl font-bold text-masar-teal">{totalCollected}/{totalStamps}</p>
          </Card>
          
          <Card className="p-4 bg-masar-gold/20">
            <div className="flex items-center mb-2">
              <Compass className="w-5 h-5 text-masar-gold mr-2" />
              <h3 className="font-medium text-masar-teal">Emirates</h3>
            </div>
            <p className="text-2xl font-bold text-masar-teal">
              {emitatesData.filter(e => e.collected > 0).length}/{emitatesData.length}
            </p>
          </Card>
        </div>
        
        {/* Progress By Emirate */}
        <h3 className="text-lg font-bold mb-3 text-masar-gold">Progress by Emirate</h3>
        <div className="space-y-4 mb-8">
          {emitatesData.map(emirate => <div key={emirate.id} className="rounded-lg p-4 shadow-sm bg-masar-cream">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-masar-blue">{emirate.name}</h4>
                <span className="text-sm text-masar-gold">
                  {emirate.collected}/{emirate.total} stamps
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div style={{
              width: `${emirate.collected / emirate.total * 100}%`
            }} className="h-2 rounded-full bg-masar-teal" />
              </div>
            </div>)}
        </div>
        
        {/* Settings & Logout */}
        <Button variant="outline" onClick={handleLogout} className="w-full border-masar-teal text-masar-teal">
          Log Out
        </Button>
      </div>
      
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
          <Button variant="ghost" className="flex flex-col items-center text-masar-teal">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
