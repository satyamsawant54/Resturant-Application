import { Flex } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SidebarWithHeader from './components/SidebarWithHeader';
import Footer from './components/Footer';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Home from './screens/Home';
import MenuScreen from './screens/MenuScreen';
import MenuEditScreen from './screens/MenuEditScreen';
import ProfileScreen from './screens/ProfileScreen';
import RestaurantEditScreen from './screens/RestaurantEditScreen';
import RestaurantListScreen from './screens/RestaurantListScreen';

function App() {
  return (
    <BrowserRouter>
      {/* Non-dashboard routes */}
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      
      {/* Dashboard routes */}
      <Route
              path='/*'
              element={
                <DashboardRoutes                  
                />
              }
            />
      
      </Routes>
    </BrowserRouter>
  );

  function DashboardRoutes() {
    return ( 
      <>
        <SidebarWithHeader />
              <Flex
                  as="main"
                  mt="0"
                  direction="column"
                  bgColor="blackAlpha.50"
                  ml={{ base: 0, md: 60 }}
              >
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path='/menu/:id' element={<MenuScreen />} />
                  <Route path='/menu/:id/edit'  element={<MenuEditScreen />} />
                  <Route path='/profile' element={<ProfileScreen />} />                  
                  <Route path='/admin/restaurantlist' element={<RestaurantListScreen />} />
                  <Route path='/admin/restaurant/:id/edit' element={<RestaurantEditScreen />} />
                </Routes>
                <Footer />
              </Flex>
        </>
      );
    }
}

export default App;