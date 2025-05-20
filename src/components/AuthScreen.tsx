
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, we'll just simulate authentication
    localStorage.setItem('isAuthenticated', 'true');
    
    // If it's a new signup, store the user's name
    if (!isLogin) {
      localStorage.setItem('userName', name);
    }
    
    toast({
      title: isLogin ? "Login successful!" : "Account created!",
      description: "Welcome to Masar",
    });
    
    // Navigate to home screen
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-masar-cream">
      <div className="flex-1 flex flex-col justify-center items-center px-8 pt-8">
        <div className="mb-8 animate-fade-in">
          <img 
            src="/lovable-uploads/21b85797-a307-41e9-bf45-70a8191c7f5c.png" 
            alt="Masar Logo" 
            className="w-40 h-auto"
          />
        </div>
        
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-masar-teal mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6"
                />
              </div>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={() => {
                // For demo purposes, skip login
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userName', 'Demo User');
                navigate('/home');
              }}
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
