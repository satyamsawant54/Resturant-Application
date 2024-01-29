import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Spacer,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Link as RouterLink,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';

import { registerRestaurant } from '../actions/restaurantActions';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';

const RegisterScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let [searchParams] = useSearchParams();
	let redirect = searchParams.get('redirect') || '/';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const restaurantRegister = useSelector((state) => state.restaurantRegister);
	const { loading, error, restaurantInfo } = restaurantRegister;

	useEffect(() => {
		if (restaurantInfo) {
			navigate(redirect);
		}
	}, [navigate, restaurantInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		}else {
			dispatch(registerRestaurant(name, email, phone,  password));
		}
	};

	return (
		<Flex 
            w={{ base: "80%", md: "60%" }} alignItems='center' justifyContent='center' py='5' mx='auto'>
			<FormContainer>
				<Heading as='h1' mb='8' fontSize='3xl'>
					Register
				</Heading>

				{error && <Message type='error'>{error}</Message>}
				{message && <Message type='error'>{message}</Message>}

				<form onSubmit={submitHandler}>
					<FormControl id='name'>
						<FormLabel htmlFor='name'>Restaurant Name</FormLabel>
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
	
					<Spacer h='3' />

					<Button type='submit' bg="brandBlue" color= "white" _hover={{ bg: 'brandGreen' }} mt='4' isLoading={loading}>
						Register
					</Button>
				</form>

				<Flex pt='10'>
					<Text fontWeight='semibold'>
						Already a Customer?{' '}
						<Link as={RouterLink} to='/'>
							Click here to login
						</Link>
					</Text>
				</Flex>
			</FormContainer>
		</Flex>
	);
};

export default RegisterScreen;