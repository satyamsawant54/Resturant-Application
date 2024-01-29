import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spacer,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import {
  getMenuDetails,
  updateMenu,
} from '../actions/menuActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { MENU_ITEM_UPDATE_RESET } from '../constants/menuConstants';

const MenuEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: menuId } = useParams();

  const [name, setName] = useState('');
  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');
  const [uploading, setUploading] = useState(false);

  const menuDetails = useSelector((state) => state.menuDetails);
  const { loading, error, menu } = menuDetails;

  const menuUpdate = useSelector((state) => state.menuUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = menuUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: MENU_ITEM_UPDATE_RESET });
      navigate(`/menu/${menuId}`);
    } else {
      if (!menu.name || menu._id !== menuId) {
        dispatch(getMenuDetails(menuId));
      } else {
        setName(menu.name);
        setDescription(menu.description);
        setPrice(menu.price);        
        setImages(menu.images);
        setQuantityInStock(menu.quantityInStock);
      }
    }
  }, [dispatch, navigate, menu, menuId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      updateMenu({
        _id: menuId,
        name,
        description, 
        price,     
        images,
        quantityInStock,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('images', file);
    setUploading(true);
  
    console.log('formData:', formData); 
  
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const { data } = await axios.post(`/api/uploads`, formData, config);
  
      console.log('Upload response:', data); 
  
      setImages(data);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };
  

  return (
    <>
    <Box py="6" px={{ base: '4', md: '10' }} bg="white">
        <Flex justify="space-between" mb="4">
        <Button
            as={RouterLink}
            to={`/menu/${menuId}`}
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
            Edit Menu
          </Heading>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message type='error'>{errorUpdate}</Message>}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message type='error'>{error}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              {/* Name */}
              <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type='text'
                  placeholder='Enter menu name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Spacer h='3' />              

              {/* Images */}
              <FormControl id='images' isRequired>
                <FormLabel>Images</FormLabel>
                <Input
                  type='text'
                  placeholder='Enter image URL'
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                />
                <Input type='file' onChange={uploadFileHandler} />
              </FormControl>
              <Spacer h='3' />

              {/* Description */}
              <FormControl id='description' isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  type='text'
                  placeholder='Enter menu description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <Spacer h='3' />

              {/* Price */}
              <FormControl id='price' isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  type='text'
                  placeholder='Enter item price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormControl>
              <Spacer h='3' />

              {/* Stock */}
              <FormControl id='quantityInStock' isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type='number'
                  placeholder='Enter estimated stock size'
                  value={quantityInStock}
                  onChange={(e) => setQuantityInStock(e.target.value)}
                />
              </FormControl>
              <Spacer h='3' />
              
              <Button
                type='submit'
                isLoading={loading}
                color='white'
                bg="brandGreen"
                _hover={{ bg: 'brandBlue' }}
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

export default MenuEditScreen;