import {
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Box,
	Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import {getRestaurantDetails, updateRestaurant } from '../actions/restaurantActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { RESTAURANT_UPDATE_RESET } from '../constants/restaurantConstants';

const RestaurantEditScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id: restaurantId } = useParams();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const restaurantDetails = useSelector((state) => state.restaurantDetails);
	const { loading, error, restaurant } = restaurantDetails;

	const restaurantUpdate = useSelector((state) => state.restaurantUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = restaurantUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: RESTAURANT_UPDATE_RESET });
			navigate('/admin/restaurantlist');
		} else {
			if (!restaurant.name || restaurant._id !== restaurantId) {
				dispatch(getRestaurantDetails(restaurantId));
			} else {
				setName(restaurant.name);
				setEmail(restaurant.email);
				setIsAdmin(restaurant.isAdmin);
			}
		}
	}, [restaurant, dispatch, restaurantId, successUpdate, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(updateRestaurant({ _id: restaurantId, name, email, isAdmin }));
	};

	return (
		<> 
		 <Box py="6" px={{ base: '4', md: '10' }} bg="white">
			<Flex justify="space-between" mb="4">
			<Button
				as={RouterLink}
				to='/admin/restaurantlist'
				bg="brandBlue"
				color="white"
				_hover={{ bg: 'brandGreen' }}
			>
				Go Back
			</Button>
			</Flex>

			<Flex w='full' alignItems='center' justifyContent='center' py='5'>
				<FormContainer>
					<Heading as='h1' mb='8' fontSize='3xl'>
						Edit User
					</Heading>

					{loadingUpdate && <Loader />}
					{errorUpdate && <Message type='error'>{errorUpdate}</Message>}

					{loading ? (
						<Loader />
					) : error ? (
						<Message type='error'>{error}</Message>
					) : (
						<form onSubmit={submitHandler}>
							<FormControl id='name' isRequired>
								<FormLabel>Name</FormLabel>
								<Input
									type='text'
									placeholder='Enter full name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormControl>
							<Spacer h='3' />

							<FormControl id='email' isRequired>
								<FormLabel>Email Address</FormLabel>
								<Input
									type='text'
									placeholder='Enter email address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormControl>
							<Spacer h='3' />

							<FormControl id='isAdmin' isRequired>
								<FormLabel>Is Admin?</FormLabel>
								<Checkbox
									size='lg'
									colorScheme='teal'
									checked={isAdmin}
									onChange={(e) => setIsAdmin(e.target.checked)}>
									Is Admin?
								</Checkbox>
							</FormControl>
							<Spacer h='3' />

							<Button
								type='submit'
								isLoading={loading}
								bg="brandBlue" 
								color= "white" 
								_hover={{ bg: 'brandGreen' }}
								mt='4'>
								Update
							</Button>
						</form>
					)}
				</FormContainer>
			</Flex>
		</Box>
		</>
	);
};

export default RestaurantEditScreen;
