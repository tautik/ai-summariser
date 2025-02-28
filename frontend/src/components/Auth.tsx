import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

interface AuthProps {
  onLogin: () => void;
}

// Define CSS animations
const keyframes = `
  @keyframes blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`;

const Auth = ({ onLogin }: AuthProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSmiling, setIsSmiling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  useEffect(() => {
    // Inject CSS animations
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);
    
    // Start title animation after component mounts
    setTimeout(() => setAnimateTitle(true), 300);
    
    // Cleanup style element on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      setIsSmiling(false);
      return false;
    }
    
    // Check for admin credentials
    if (username === 'admin' && password === 'admin') {
      setError(null);
      setIsSmiling(true);
      return true;
    } else {
      setError('Invalid credentials. Try admin/admin');
      setIsSmiling(false);
      return false;
    }
  };

  useEffect(() => {
    // Reset smile when credentials change
    if (isSmiling) {
      setIsSmiling(false);
    }
  }, [username, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Delay login to show the smile and loading animation
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  // Split title into characters for animation
  const titleChars = "AI Summarizer".split('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-20 -right-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <Card className="w-full max-w-md relative overflow-hidden backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl transition-all duration-500 hover:shadow-blue-200/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
        
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6 mt-2">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center transition-all duration-500 ${isSmiling ? 'scale-110' : 'scale-100'}`}>
              <div className="relative w-20 h-20">
                {/* Eyes with blinking animation */}
                <div className={`absolute top-3 left-3 w-4 h-${isSmiling ? '3' : '4'} rounded-full bg-blue-500 transition-all duration-300`} style={{animation: 'blink 4s infinite'}}></div>
                <div className={`absolute top-3 right-3 w-4 h-${isSmiling ? '3' : '4'} rounded-full bg-blue-500 transition-all duration-300`} style={{animation: 'blink 4s infinite', animationDelay: '0.2s'}}></div>
                
                {/* Mouth - changes based on login state */}
                {isSmiling ? (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-6 border-b-4 border-blue-500 rounded-b-full transition-all duration-500"></div>
                ) : (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded transition-all duration-500"></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mb-1">
              <div className="flex justify-center">
                {titleChars.map((char, index) => (
                  <span 
                    key={index} 
                    className={`inline-block transition-all duration-700 ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
            </CardTitle>
          </div>
          
          <CardDescription className="text-gray-600 mt-2 opacity-0 animate-fadeIn" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
            Sign in with admin/admin to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 relative">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                <span>Username</span>
              </label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              />
              <div className="absolute bottom-2.5 left-3 text-gray-400">
                <FaUser />
              </div>
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaLock className="text-blue-500" />
                <span>Password</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                />
                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100 flex items-center justify-center animate-shake">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full relative overflow-hidden group ${isLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-4 h-12`}
              disabled={isLoading}
            >
              <span className={`absolute inset-0 w-full h-full transition-all duration-300 ${isLoading ? 'translate-y-0' : 'translate-y-full'} bg-gradient-to-r from-blue-400 to-indigo-500`}>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </span>
              <span className={`relative transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} font-medium`}>
                Sign In
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth; 