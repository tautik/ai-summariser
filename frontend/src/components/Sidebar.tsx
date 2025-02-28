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
  FaSignOutAlt 
} from 'react-icons/fa';

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
}

const NavItem = ({ icon: Icon, children, isActive, onClick }: NavItemProps) => {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

const Sidebar = ({ onNavigate, activePage, onLogout }: SidebarProps) => {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex items-center p-6">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <span className="ml-3 text-xl font-bold">AI Summarizer</span>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          <NavItem 
            icon={FaHome} 
            isActive={activePage === 'home'}
            onClick={() => onNavigate('home')}
          >
            Home
          </NavItem>
          <NavItem 
            icon={FaTwitter} 
            isActive={activePage === 'twitter'}
            onClick={() => onNavigate('twitter')}
          >
            Twitter
          </NavItem>
          <NavItem 
            icon={FaReddit} 
            isActive={activePage === 'reddit'}
            onClick={() => onNavigate('reddit')}
          >
            Reddit
          </NavItem>
          <NavItem 
            icon={FaEnvelope} 
            isActive={activePage === 'gmail'}
            onClick={() => onNavigate('gmail')}
          >
            Gmail
          </NavItem>
          <NavItem 
            icon={FaFacebook} 
            isActive={activePage === 'facebook'}
            onClick={() => onNavigate('facebook')}
          >
            Facebook
          </NavItem>
          <NavItem 
            icon={FaCog} 
            isActive={activePage === 'settings'}
            onClick={() => onNavigate('settings')}
          >
            Settings
          </NavItem>
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 