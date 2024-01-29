import jwt from 'jsonwebtoken';

const generateToken = (id) => {
	try {
	  return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	  });
	} catch (error) {
	  console.error('Token generation error:', error);
	  throw new Error('Token generation error');
	}
  };
  
  export default generateToken;
  