import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown, 
} from 'react-icons/fi';
import { IoRestaurantOutline, IoSparklesOutline } from "react-icons/io5";
import { IoMdListBox, IoMdHelp } from "react-icons/io";
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { logoutRestaurant } from '../actions/restaurantActions';

const LinkItems = [
  { name: 'Home', icon: IoRestaurantOutline, to: '/home' },  
  { name: 'Orders', icon: IoMdListBox, to: '/orders' },
  { name: 'Reviews', icon: IoSparklesOutline, to: '/reviews' },
  { name: 'Reports', icon: FiTrendingUp, to: '/reports' },
  { name: 'Settings', icon: FiSettings, to: '/settings' },
  { name: 'Help', icon: IoMdHelp, to: '/help' },
];

const SidebarContent = ({ onClose }) => {
    return (
    <Box
      transition="3s ease"
      bg="brandBlue"
      borderRight="1px"
      borderRightColor="brandGreen"
      w={{ base: 80, md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
        eats~
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color="white" />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} color="white" onClose={onClose}>
          <RouterLink to={link.to} style={{ textDecoration: 'none' }}>
            {link.name}
          </RouterLink>
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, onClose, ...rest }) => {

  const handleClick = () => {
    onClose();
  };

  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'brandGreen',
          color: 'white',
        }}
        {...rest}
        onClick={handleClick}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const restaurantLogin = useSelector((state) => state.restaurantLogin);
  const { restaurantInfo } = restaurantLogin;

  const logoutHandler = () => {
    dispatch(logoutRestaurant());
    navigate('/');
  };

  useEffect(() => {
    if (!restaurantInfo) {
      navigate('/');
    }
  }, [navigate, restaurantInfo]);

  if (!restaurantInfo) {
    return null; 
  }

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="brandBlue"
      borderBottomWidth="1px"
      borderBottomColor="brandGreen"
      color="white"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        bg="white"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display='flex'
        mr={{ base: '100', md: '150' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
        color="white"
      >
        eats~
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <NavLink to="/notifications" style={{ textDecoration: 'none' }}>
          <IconButton
            mr={4}
            size="lg"
            variant="outline"
            aria-label="open menu"
            color="white"
            _hover={{ bg: 'brandGreen' }}
            icon={<FiBell />}
          />
        </NavLink>
        <Flex alignItems={'center'}>
          {restaurantInfo ? (
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }} mr={4}>
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={ restaurantInfo?.icon ? restaurantInfo?.icon : 
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                  />
                  <VStack display='flex' alignItems="flex-start" spacing="1px" ml="2">
                    <Text fontSize="sm">{restaurantInfo?.name}</Text>
                    <Text fontSize="xs" color="white">
                      Welcome ✨
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList bg="brandBlue" color="black" borderColor="brandGreen">
                <MenuItem>
                  <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                    Profile
                  </NavLink>
                </MenuItem>
                <MenuDivider />
                {restaurantInfo.isAdmin && (
                  <>
                    <MenuItem>
                      <NavLink to="/admin/restaurantlist" style={{ textDecoration: 'none' }}>
                        Manage Users
                      </NavLink>
                    </MenuItem>
                    <MenuDivider />
                  </>
                )}
                <MenuItem>
                  <NavLink onClick={logoutHandler} style={{ textDecoration: 'none' }}>
                    Logout
                  </NavLink>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Text color="white">Not logged in</Text>
          )}
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48em)'); 
  
  return (
    <Box bg="brandBlue">
      {!isMobile && <SidebarContent onClose={onClose} />}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        w="50%"
      >
        <DrawerContent bg="brandBlue">
        <SidebarContent onClose={onClose}  />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />      
    </Box>
  );
};

export default SidebarWithHeader;
