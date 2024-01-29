import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Flex
      as='footer'
      justifyContent='center'
      alignItems='center'
      py='2'
      flexDirection='column'
      textAlign='center'
      fontFamily="'Lato', sans-serif"
      bg="white"
    >

      {/* Copyright Text */}
      <Text mt='3' fontWeight='semibold'>
        &copy; {new Date().getFullYear()} eats~ .
      </Text>
    </Flex>
  );
};

export default Footer;