
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkExistingSession = async () => {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            // User is authenticated
            localStorage.setItem('userName', session.user.user_metadata.name || '');
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUserEmail', session.user.email || '');
            navigate('/home');
          }
        }
      );
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already authenticated, redirect
        localStorage.setItem('userName', session.user.user_metadata.name || '');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUserEmail', session.user.email || '');
        navigate('/home');
      }
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkExistingSession();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple validation
      if (!email || !password || (!isLogin && !name)) {
        toast({
          title: "Please fill in all fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Clean up any existing auth state
        cleanupAuthState();
        
        // Attempt to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Login successful!",
            description: "Welcome back to Masar"
          });
        }
      } else {
        // This is a sign up
        // Clean up any existing auth state
        cleanupAuthState();
        
        // Register the new user with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast({
            title: "Account created!",
            description: "Welcome to Masar"
          });
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Demo credentials (you should change this to use actual demo account)
      const demoEmail = "demo@example.com";
      const demoPassword = "demopassword";
      
      // Create demo account if it doesn't exist
      try {
        const { data, error } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: {
              name: 'Demo User',
            }
          }
        });
        
        if (!error || error.message.includes('already registered')) {
          // Either created or already exists, try to sign in
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword
          });
          
          if (signInError) throw signInError;
          
          // Reset progress tracking for demo user
          localStorage.removeItem('hasViewedHomeScreen');
          localStorage.removeItem('hasViewedProfileBefore');
          
          toast({
            title: "Welcome, Demo User!",
            description: "You're using a demo account"
          });
        } else {
          throw error;
        }
      } catch (error: any) {
        console.error('Demo login error:', error);
        toast({
          title: "Demo login failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
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
                disabled={loading} 
              />
            </div>
            
            <div>
              <Input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="bg-white border-masar-mint focus:border-masar-teal rounded-xl py-6"
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-masar-teal hover:bg-masar-teal/90 text-white rounded-xl py-6 h-auto font-medium text-lg"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-masar-teal hover:text-masar-teal/80"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={handleDemoLogin} 
              className="text-masar-gold hover:text-masar-gold/80"
              disabled={loading}
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
