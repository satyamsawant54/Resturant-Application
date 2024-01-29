import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { IoPencilSharp, IoTrashBinSharp } from 'react-icons/io5';
import { AiOutlineLike } from "react-icons/ai";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { getMenuDetails, deleteMenu } from '../actions/menuActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MenuScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id } = useParams();

  const menuDetails = useSelector((state) => state.menuDetails);
  const { loading, error, menu } = menuDetails;

  const menuDelete = useSelector((state) => state.menuDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = menuDelete;

  useEffect(() => {
    dispatch(getMenuDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (successDelete) {
      navigate.push('/home');
    }
  }, [successDelete, navigate]);

  const deleteHandler = () => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      dispatch(deleteMenu(id));
    }
  };
  
  return (
    <>
      <Box py="6" px={{ base: '4', md: '10' }} bg="white">
        <Flex justify="space-between" mb="4">
          <Button
            onClick={() => navigate('/home')}
            bg="brandBlue"
            color="white"
            _hover={{ bg: 'brandGreen' }}
          >
            Go Back
          </Button>
        </Flex>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: '5fr 4fr 3fr' }} gap="10">
            <Image src={menu.images} alt={menu.name} borderRadius="md" />

            <Flex direction="column">
              <Heading as="h6" fontSize="4xl" mb="4">
                {menu.name}
              </Heading>              

              <Text>{menu.description}</Text>

              <Flex justifyContent="space-between" py="2">
                <Text m={2} fontWeight="bold">
                  Price:
                </Text>
                <Text fontWeight="semibold">KSh {menu.price}</Text>
              </Flex>

              <Flex justifyContent="space-between" py="2">
                <Text fontWeight="bold">In stock:</Text>
                <Text fontSize="md" fontWeight="bold" >
                  {menu.quantityInStock}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" py="2">
                <Text fontWeight="bold">Popularity:</Text>
                <Text fontWeight="semibold">{menu.popularity}</Text>
                <Icon as={AiOutlineLike} size="sm" m={2} />
              </Flex>
            </Flex>

            <Flex direction="column">              
              <Flex justifyContent="flex-end" py="2">
                <Button
                  as={RouterLink}
                  to={`/menu/${menu._id}/edit`}
                  bg="gray.800"
                  colorScheme="teal"
                  m="2"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  _hover={{ bg: 'brandGreen' }}
                >
                  <Icon as={IoPencilSharp} size="sm" m={2} />
                  Edit menu
                </Button>

                <Button
                  bg="red.500"
                  color="white"
                  m="2"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  _hover={{ bg: 'pink.900' }}
                  onClick={onOpen}
                >
                  <Icon as={IoTrashBinSharp} size="sm" m={2} />
                  Delete Menu
                </Button>
              </Flex>
            </Flex>
          </Grid>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this menu item?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={deleteHandler} isLoading={loadingDelete} m={2}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose} m={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {loadingDelete && <Loader />}
      {errorDelete && <Message type="error">{errorDelete}</Message>}
    </>
  );
};

export default MenuScreen;