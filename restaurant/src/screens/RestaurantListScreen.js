import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Table,
	Tbody,
	VStack,
	Text, 
  } from '@chakra-ui/react';
  import {
	IoCheckmarkCircleSharp,
	IoCloseCircleSharp,
	IoPencilSharp,
	IoTrashBinSharp,
  } from 'react-icons/io5';
  import { useEffect } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { Link as RouterLink, useNavigate } from 'react-router-dom';
  import { deleteRestaurant, listRestaurants } from '../actions/restaurantActions';
  import Loader from '../components/Loader';
  import Message from '../components/Message';
  
  const RestaurantListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
  
	const restaurantList = useSelector((state) => state.restaurantList);
	const { loading, error, restaurants } = restaurantList;
  
	const restaurantLogin = useSelector((state) => state.restaurantLogin);
	const { restaurantInfo } = restaurantLogin;
  
	const restaurantDelete = useSelector((state) => state.restaurantDelete);
	const { success } = restaurantDelete;
  
	useEffect(() => {
	  if (restaurantInfo && restaurantInfo.isAdmin) {
		dispatch(listRestaurants());
	  } else {
		navigate('/login');
	  }
	}, [dispatch, navigate, restaurantInfo, success]);
  
	const deleteHandler = (id) => {
	  dispatch(deleteRestaurant(id));
	};
  
	return (
	  <>
		<Heading as="h1" fontSize="3xl" mb="5">
		  Users
		</Heading>
		{loading ? (
		  <Loader />
		) : error ? (
		  <Message type="error">{error}</Message>
		) : (
		  <Box bgColor="white" rounded="lg" shadow="lg" px="5" py="5" w={{ base: "80%", md: "60%" }} mx='auto'>
			<Table variant="striped" colorScheme="gray" size="sm">			 
			  <Tbody>
				{restaurants.map((restaurant) => (
				  <VStack
					key={restaurant._id}
					spacing="2"
					borderBottom="1px"
					borderColor="gray.200"
					pb="2"
					mb="2"
				  >
					<Flex justifyContent="space-between" width="100%">
					  <Text fontWeight="bold">ID</Text>
					  <Text>{restaurant._id}</Text>
					</Flex>
					<Flex justifyContent="space-between" width="100%">
					  <Text fontWeight="bold">NAME</Text>
					  <Text>{restaurant.name}</Text>
					</Flex>
					<Flex justifyContent="space-between" width="100%">
					  <Text fontWeight="bold">EMAIL</Text>
					  <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
					</Flex>
					<Flex justifyContent="space-between" width="100%">
					  <Text fontWeight="bold">ADMIN</Text>
					  {restaurant.isAdmin ? (
						<Icon
						  as={IoCheckmarkCircleSharp}
						  color="green.600"
						  w="8"
						  h="8"
						/>
					  ) : (
						<Icon
						  as={IoCloseCircleSharp}
						  color="red.600"
						  w="8"
						  h="8"
						/>
					  )}
					</Flex>
					<Flex justifyContent="flex-end" alignItems="center" width="100%">
					  <Button
						as={RouterLink}
						to={`/admin/restaurant/${restaurant._id}/edit`}
						colorScheme="teal"
						m={4}
					  >
						<Icon as={IoPencilSharp} color="white" size="sm" />
					  </Button>
					  <Button
						colorScheme="red"
						onClick={() => deleteHandler(restaurant._id)}
						m={4}
					  >
						<Icon as={IoTrashBinSharp} color="white" size="sm" />
					  </Button>
					</Flex>
				  </VStack>
				))}
			  </Tbody>
			</Table>
		  </Box>
		)}
	  </>
	);
  };
  
  export default RestaurantListScreen;
  