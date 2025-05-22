
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

// Helper function to get user-specific storage key
const getUserStorageKey = (key: string, userEmail: string): string => {
  return `${userEmail}_${key}`;
};

// Generate a simple session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkExistingSession = () => {
      const sessionToken = localStorage.getItem('sessionToken');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      // If we have a session token and user email, try to resume the session
      if (sessionToken && currentUserEmail && isAuthenticated === 'true') {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = storedUsers.some((user: any) => user.email === currentUserEmail);
        
        if (userExists) {
          // Valid session, redirect to home
          navigate('/home');
        } else {
          // Invalid session, clear it
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('currentUserEmail');
          localStorage.removeItem('isAuthenticated');
        }
      }
    };
    
    checkExistingSession();
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (isLogin) {
      // Check if this user has signed up before
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find((user: any) => user.email === email);
      
      if (!foundUser) {
        toast({
          title: "Account not found",
          description: "Please sign up first",
          variant: "destructive"
        });
        return;
      }
      
      if (foundUser.password !== password) {
        toast({
          title: "Invalid password",
          description: "Please check your password and try again",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a session token
      const sessionToken = generateSessionToken();
      
      // User exists, proceed with login and set the userName from the stored user data
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('userName', foundUser.name);
      localStorage.setItem('sessionToken', sessionToken);
      
      toast({
        title: "Login successful!",
        description: "Welcome back to Masar"
      });
      
      // Navigate to home page
      navigate('/home');
    } else {
      // This is a sign up
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.some((user: any) => user.email === email);
      
      if (userExists) {
        toast({
          title: "Email already registered",
          description: "Please log in instead",
          variant: "destructive"
        });
        return;
      }
      
      // Generate a session token
      const sessionToken = generateSessionToken();
      
      // Register the new user
      const now = new Date();
      const registeredAt = now.toISOString();
      const joinDate = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      
      registeredUsers.push({
        email,
        name,
        password, // Note: In a real app, never store passwords in plaintext
        registeredAt
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('userName', name);
      localStorage.setItem('sessionToken', sessionToken);
      
      // Initialize user data - make sure it's empty for new users
      localStorage.setItem(getUserStorageKey('userJoinDate', email), joinDate);
      localStorage.setItem(getUserStorageKey('userPoints', email), '0');
      localStorage.setItem(getUserStorageKey('collectedStamps', email), '{}');
      
      toast({
        title: "Account created!",
        description: "Welcome to Masar"
      });
      
      // Navigate directly to home
      navigate('/home');
    }
  };

  const handleDemoLogin = () => {
    // For demo purposes, skip login
    const sessionToken = generateSessionToken();
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Demo User');
    localStorage.setItem('currentUserEmail', 'demo@example.com');
    localStorage.setItem('sessionToken', sessionToken);
    
    // Reset progress tracking for demo user
    localStorage.removeItem('hasViewedHomeScreen');
    localStorage.removeItem('hasViewedProfileBefore');
    localStorage.setItem('demo@example.com_userPoints', '0');
    localStorage.setItem('demo@example.com_collectedStamps', '{}');
    
    toast({
      title: "Welcome, Demo User!",
      description: "You're using a demo account with no progress"
    });
    
    // Navigate directly to home
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-masar-cream">
      <div className="flex-1 flex flex-col justify-center items-center px-8 pt-8">
        <div className="mb-8 animate-fade-in">
          <img alt="Masar Logo" className="w-40 h-auto" src="/lovable-uploads/e30f278e-11ed-4334-a4ec-e8f6bc9f837e.png" />
        </div>
        
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-masar-blue">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6" 
                />
              </div>
            )}
            
            <div>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6" 
              />
            </div>
            
            <div>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6" 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white rounded-xl py-6 h-auto font-medium text-lg"
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-masar-teal hover:text-masar-teal/80"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={handleDemoLogin} 
              className="text-masar-gold hover:text-masar-gold/80"
            >
              Continue as Demo User
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-masar-teal h-1/4 rounded-t-3xl mt-8 flex items-center justify-center">
        <div className="max-w-xs text-center px-8">
          <h3 className="text-white text-lg font-medium mb-2">Ready for adventure?</h3>
          <p className="text-masar-mint text-sm">
            Join Masar and start collecting stamps across the Emirates
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
