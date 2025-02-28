import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FaHome, 
  FaTwitter, 
  FaReddit, 
  FaEnvelope, 
  FaFacebook, 
  FaCog, 
  FaSignOutAlt,
  FaBrain,
  FaChartLine
} from 'react-icons/fa';
import { useEffect, useState } from "react";

interface SidebarProps {
  onNavigate: (page: string) => void;
  activePage: string;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  delay?: number;
}

const NavItem = ({ icon: Icon, children, isActive, onClick, delay = 0 }: NavItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      onClick={onClick}
      style={{
        background: isActive ? 'linear-gradient(90deg, rgba(66, 153, 225, 0.9) 0%, rgba(99, 179, 237, 0.9) 100%)' : '',
        boxShadow: isActive ? '0 4px 14px rgba(66, 153, 225, 0.25)' : 'none',
        transitionDelay: `${delay}ms`
      }}
    >
      <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-white' : ''}`} />
      <span className={`${isActive ? 'font-medium' : ''}`}>{children}</span>
      {isActive && (
        <div className="absolute right-2 w-1 h-1 rounded-full bg-white animate-pulse"></div>
      )}
    </Button>
  );
};

const Sidebar = ({ onNavigate, activePage, onLogout }: SidebarProps) => {
  const [logoAnimated, setLogoAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/80 backdrop-blur-md shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-100 rounded-full opacity-20"></div>
      
      <div className={`flex items-center p-6 transition-all duration-700 ${logoAnimated ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
          <FaBrain className="text-white h-5 w-5" />
        </div>
        <div className="ml-3">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">AI Summarizer</span>
          <div className="text-xs text-gray-500 mt-0.5">Smart insights</div>
        </div>
      </div>
      
      <Separator className="opacity-30" />
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1.5 py-4">
          <NavItem 
            icon={FaHome} 
            isActive={activePage === 'home'}
            onClick={() => onNavigate('home')}
            delay={0}
          >
            Dashboard
          </NavItem>
          <NavItem 
            icon={FaTwitter} 
            isActive={activePage === 'twitter'}
            onClick={() => onNavigate('twitter')}
            delay={50}
          >
            Twitter
          </NavItem>
          <NavItem 
            icon={FaReddit} 
            isActive={activePage === 'reddit'}
            onClick={() => onNavigate('reddit')}
            delay={100}
          >
            Reddit
          </NavItem>
          <NavItem 
            icon={FaEnvelope} 
            isActive={activePage === 'gmail'}
            onClick={() => onNavigate('gmail')}
            delay={150}
          >
            Gmail
          </NavItem>
          <NavItem 
            icon={FaFacebook} 
            isActive={activePage === 'facebook'}
            onClick={() => onNavigate('facebook')}
            delay={200}
          >
            Facebook
          </NavItem>
          
          <div className="pt-4 pb-2">
            <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Analytics
            </div>
          </div>
          
          <NavItem 
            icon={FaChartLine} 
            isActive={activePage === 'insights'}
            onClick={() => onNavigate('insights')}
            delay={250}
          >
            Insights
          </NavItem>
          
          <NavItem 
            icon={FaCog} 
            isActive={activePage === 'settings'}
            onClick={() => onNavigate('settings')}
            delay={300}
          >
            Settings
          </NavItem>
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full justify-start transition-all duration-500 hover:bg-red-600 opacity-90 hover:opacity-100"
          onClick={onLogout}
          style={{
            background: 'linear-gradient(90deg, rgba(229, 62, 62, 0.9) 0%, rgba(245, 101, 101, 0.9) 100%)',
            boxShadow: '0 4px 14px rgba(229, 62, 62, 0.15)',
            transform: 'translateY(0)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(229, 62, 62, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(229, 62, 62, 0.15)';
          }}
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 