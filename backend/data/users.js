import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    phone: '1234567890',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    pincode: bcrypt.hashSync('1234', 10),    
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    pincode: bcrypt.hashSync('1234', 10),    
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '5555555555',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    pincode: bcrypt.hashSync('123456', 10),
    },
];

export default users;
