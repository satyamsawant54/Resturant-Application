import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { getRestaurantDetails, updateRestaurantProfile } from '../actions/restaurantActions';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import { RESTAURANT_DETAILS_RESET } from '../constants/restaurantConstants';

const ProfileScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');	
    const [phone, setPhone] = useState('');
  	const [icon, setIcon] = useState('');  
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');

	const restaurantDetails = useSelector((state) => state.restaurantDetails);
	const { loading, error, restaurant } = restaurantDetails;

	const restaurantLogin = useSelector((state) => state.restaurantLogin);
	const { restaurantInfo } = restaurantLogin;

	const restaurantUpdateProfile = useSelector((state) => state.restaurantUpdateProfile);
	const { success } = restaurantUpdateProfile;

	useEffect(() => {
		if (!restaurantInfo) {
		  navigate('/');
		} else {
		  if (!restaurantInfo.name) {
			dispatch(getRestaurantDetails());
		  } else {
			setName(restaurantInfo.name);
			setEmail(restaurantInfo.email);
			setPhone(restaurantInfo.phone);
			setIcon(restaurantInfo.icon);
		  }
		}
	  }, [dispatch, navigate, restaurantInfo, success]);
	  

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');		
		} else {
			dispatch(updateRestaurantProfile({ id: restaurant._id, name, email, phone, icon, password }));
			dispatch({ type: RESTAURANT_DETAILS_RESET });
		}
	};

	const uploadIconHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('icon', file);
	
		try {
		  const config = {
			headers: {
			  'Content-Type': 'multipart/form-data',
			},
		  };
	
		  const { data } = await axios.post(`/api/uploads/icon`, formData, config);
	
		  setIcon(data); 
		} catch (err) {
		  console.error(err);
		}
	  };
	
	return (
			<Flex w={{ base: "80%", md: "60%" }} alignItems='center' justifyContent='center' py='5' mx='auto'>
				<FormContainer>
					<Heading as='h1' mb='8' fontSize='3xl'>
						Restaurant Profile
					</Heading>

					{error && <Message type='error'>{error}</Message>}
					{message && <Message type='error'>{message}</Message>}

					<form onSubmit={submitHandler}>
						<FormControl id='name'>
							<FormLabel htmlFor='name'> Name</FormLabel>
							<Input
								id='name'
								type='text'
								placeholder='restaurant name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</FormControl>

						<Spacer h='3' />

						<FormControl id='email'>
							<FormLabel htmlFor='email'>Email address</FormLabel>
							<Input
								id='email'
								type='email'
								placeholder='username@domain.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>

						<Spacer h='3' />

						<FormControl id='phone'>
							<FormLabel htmlFor='phone'>Phone</FormLabel>
							<Input
								id='phone'
								type='number'
								placeholder='0XXX XXXXXX'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</FormControl>

						<Spacer h='3' />

						<FormControl id='icon'>
							<FormLabel htmlFor='icon'>Restaurant Icon</FormLabel>
							<Input type='file' onChange={uploadIconHandler} />
						</FormControl>

						<Spacer h='3' />
						
						<FormControl id='password'>
							<FormLabel htmlFor='password'>Password</FormLabel>
							<Input
								id='password'
								type='password'
								placeholder='************'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>

						<Spacer h='3' />

						<FormControl id='confirmPassword'>
							<FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
							<Input
								id='confirmPassword'
								type='password'
								placeholder='************'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</FormControl>

						<Button type='submit' bg="brandBlue" color= "white" _hover={{ bg: 'brandGreen' }} mt='4' isLoading={loading}>
							Update
						</Button>
					</form>
				</FormContainer>
			</Flex>

	);
};

export default ProfileScreen;
