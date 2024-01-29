import { useEffect, useState } from 'react';
import { Grid, Box, Heading, Input, Button, Flex,  Center, Icon, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { IoAdd } from 'react-icons/io5';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';

import { getRestaurantMenu, createMenu } from '../actions/menuActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import MenuCard from '../components/MenuCard';

import { MENU_CREATION_RESET } from '../constants/menuConstants';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantMenu = useSelector((state) => state.restaurantMenu);
  const { loading, error, menus } = restaurantMenu;
  const [keyword, setKeyword] = useState('');
  const menuCreate = useSelector((state) => state.menuCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		property: createdMenu,
	} = menuCreate;


  useEffect(() => {
    dispatch(getRestaurantMenu());
  }, [dispatch]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (!keyword.trim()) {
          dispatch(getRestaurantMenu());
          return;
        }

        const response = await axios.get(`/api/properties?keyword=${keyword}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        dispatch({
          type: 'RESTAURANT_MENU_SUCCESS',
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: 'RESTAURANT_MENU_FAIL',
          payload: 'Error fetching properties. Please try again later.',
        });
      }
    };

    fetchMenus();
  }, [dispatch, keyword]);

  const handleSearch = async () => {
    try {
      if (!keyword.trim()) {
        dispatch(getRestaurantMenu());
        return;
      }

      const response = await fetch(`/api/restaurant/menu?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch({
        type: 'RESTAURANT_MENU_SUCCESS',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'RESTAURANT_MENU_FAIL',
        payload: 'Error fetching our menu. Please try again later.',
      });
    }
  };

  useEffect(() => {
    dispatch({ type: MENU_CREATION_RESET });
    
    if (successCreate) {
      navigate(`/menu/${createdMenu._id}/edit`); 
    } else {
      dispatch(getRestaurantMenu());
    }
  }, [dispatch, successCreate, createdMenu, navigate]);

  const createMenuHandler = () => {
		dispatch(createMenu());
	};

  

  return (
    <>
    <Box p="4" bg="white" borderRadius="lg" boxShadow="md" m={2} width='100%'>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          List
        </Text>
        </Flex>

      {/* Search Bar */}
      <Center my='4'>
        <Flex w={['100%', '100%', '50%']} justifyContent={['center', 'center', 'flex-end']} alignItems='center'>
          <Input
            placeholder='Search in our menu...'
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            mr='2'
            w='100%'
            maxW='600px'
            bg='white'
            color='black'
            _placeholder={{ color: 'white' }}
          />
          {loadingCreate && <Loader />}
          {errorCreate && <Message type='error'>{errorCreate}</Message>}
          <Button bg='brandBlue' color="white" _hover={{bg: 'brandGreen' }} onClick={handleSearch}>
            Search
          </Button>
        </Flex>
        <Button onClick={createMenuHandler} bg='brandGreen' color="white" _hover={{bg: 'green.500' }} m={6}>
					<Icon as={IoAdd} mr='2' fontSize='xl' fontWeight='bold' /> 
          Create Menu
				</Button>
      </Center>

      {/* Menu  */}
      <Heading as='h2' mb='8' color='black' fontSize={['lg', 'xl', '2xl']}>
        Our Menu
      </Heading>

      {/* Menu List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message type='error'>{error}</Message>
      ) : Array.isArray(menus) && menus.length > 0 ? (
        <Grid templateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr 1fr']} gap={['4', '8']}>
          {menus.map((menu) => (
            <MenuCard key={menu._id} menu={menu} />
          ))}
        </Grid>
      ) : (
        <Message>No Menu found.</Message>
      )}
    </Box>
    </>
  );
};

export default Home;