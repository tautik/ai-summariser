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
  FaHeadphones
} from 'react-icons/fa';
import { useEffect, useState } from "react";
import React from 'react';
import { Link } from 'react-router-dom';

export interface SidebarProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
  path: string;
  delay?: number;
}

const NavItem = ({ icon: Icon, children, isActive, path, delay = 0 }: NavItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Link to={path} className="w-full block">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
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
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onNavigate, activePage }) => {
  const [logoAnimated, setLogoAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const navItems = [
    { id: 'home', name: 'Dashboard', icon: FaHome, path: '/' },
    { id: 'twitter', name: 'Twitter', icon: FaTwitter, path: '/twitter' },
    { id: 'gmail', name: 'Gmail', icon: FaEnvelope, path: '/gmail' },
    { id: 'reddit', name: 'Reddit', icon: FaReddit, path: '/reddit' },
    { id: 'facebook', name: 'Facebook', icon: FaFacebook, path: '/facebook' },
    { id: 'audio-summary', name: 'Audio Summary', icon: FaHeadphones, path: '/audio-summary' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/80 backdrop-blur-md shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-100 rounded-full opacity-20"></div>
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-100 rounded-full opacity-20"></div>
      
      <div className={`flex items-center p-6 transition-all duration-700 ${logoAnimated ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
          <FaBrain className="text-white h-6 w-6" />
        </div>
        <div className="ml-3">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">AI Summarizer</span>
          <div className="text-xs text-gray-500 mt-1">Smart insights</div>
        </div>
      </div>
      
      <Separator className="opacity-30 my-2" />
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-6">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              isActive={activePage === item.id}
              path={item.path}
              delay={navItems.indexOf(item) * 50}
            >
              {item.name}
            </NavItem>
          ))}
          
          <Separator className="opacity-30 my-3" />
          
          <NavItem 
            icon={FaCog} 
            isActive={activePage === 'settings'}
            path="/settings"
            delay={250}
          >
            Settings
          </NavItem>
        </div>
      </ScrollArea>

      <div className="p-6">
        <Button
          variant="destructive"
          className="w-full justify-start transition-all duration-500 hover:bg-red-600 opacity-90 hover:opacity-100 py-3"
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