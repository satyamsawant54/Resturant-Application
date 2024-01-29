import bcrypt from 'bcryptjs';

const restaurants = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    phone: '9999999999',
    password: bcrypt.hashSync('123456', 10),  
    isAdmin: true,    
  },

  {
    name: 'Stew HQs',
    email: 'stew@example.com',
    phone: '1111111111',
    password: bcrypt.hashSync('123456', 10), 
    isAdmin: false,   
  },

  {
    name: 'Oak Place',
    email: 'oak@example.com',
    phone: '1111111112',
    password: bcrypt.hashSync('123456', 10),   
    isAdmin: false,   
  },
];

export default restaurants;
