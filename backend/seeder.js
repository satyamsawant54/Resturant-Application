import colors from 'colors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import users from './data/users.js';
import restaurants from './data/restaurants.js'; 
import User from './models/userModel.js';
import Restaurant from './models/restaurantModel.js'; 

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany(); 

    await User.insertMany(users);
    await Restaurant.insertMany( restaurants );

    console.log(`Data imported`.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany(); 

    console.log(`Data destroyed`.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
