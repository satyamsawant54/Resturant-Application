import { Box, Text, Flex, Image, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const MenuCard = ({ menu }) => {
  
  return (
    <Link
			as={RouterLink}
			to={`/menu/${menu._id}`}
			_hover={{ textDecor: 'none' }}>
      <Box
        borderRadius='lg'
        overflow='hidden'
        bg="white"
        boxShadow="0px 24px 34px rgba(80, 79, 89, 0.14)"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="start"
        padding="2"
        gap="12px"
        mb={4}
        width={['100%']}
        transition='transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
        _hover={{
          boxShadow: 'lg',
          transform: 'translateY(-5px)',
        }}
        rounded="lg"
      >
        <Image
          src={menu.images[0]}
          alt={menu.project}
          w='full'
          h='200px'
          objectFit='cover'
        />
        <Flex py='4' px='3' direction='column' justifyContent='space-between'>
          <Text fontSize='lg' fontWeight='bold'>
            {menu.name}
          </Text>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize='md' color='gray.600'>
                    {menu.price}
                </Text>          
            </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default MenuCard;