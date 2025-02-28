import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Avatar,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
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

const NavItem = ({ icon, children, isActive, onClick }: NavItemProps) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight={isActive ? "semibold" : "normal"}
      color={isActive ? activeColor : inactiveColor}
      bg={isActive ? activeBg : "transparent"}
      borderRadius="md"
      _hover={{
        bg: isActive ? activeBg : hoverBg,
        color: isActive ? activeColor : inactiveColor,
      }}
      onClick={onClick}
    >
      <Icon
        mr="4"
        fontSize="16"
        as={icon}
      />
      <Text fontSize="md">{children}</Text>
    </Flex>
  );
};

const Sidebar = ({ onNavigate, activePage, onLogout }: SidebarProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="fixed"
      left="0"
      w="64"
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      py="5"
    >
      <Flex
        direction="column"
        h="full"
        px="4"
      >
        <Flex align="center" mb="8" px="2">
          <Avatar size="md" name="AI Summarizer" src="/logo.png" />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            ml="3"
          >
            AI Summarizer
          </Text>
        </Flex>

        <VStack spacing="1" align="stretch" flex="1">
          <NavItem 
            icon={FaHome} 
            isActive={activePage === 'home'}
            onClick={() => onNavigate('home')}
          >
            Dashboard
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
        </VStack>

        <Box mt="6">
          <Button
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            variant="outline"
            width="full"
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar; 