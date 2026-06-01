require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const chalk = require('chalk');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/se_agency');
    console.log(chalk.cyan('Connected to MongoDB for seeding...'));

    const adminExists = await User.findOne({ role: 'superadmin' });

    
      const superadmin = new User({
        username: 'SherifElanwar',
        email: 'SherifElanwar@gmail.com',
        phoneNumber: '01229072306',
        password: 'SherifElanwar123!', // You should change this in production
        role: 'superadmin',
      });

      await superadmin.save();
      console.log(chalk.green.bold('Superadmin account created successfully!'));
      console.log(chalk.gray('Username: superadmin'));
      console.log(chalk.gray('Password: Password123!'));
      

   

  } catch (error) {
    console.error(chalk.red.bold('Error seeding admin:'), error.message);
  } finally {
    await mongoose.connection.close();
    console.log(chalk.cyan('MongoDB connection closed.'));
  }
};

seedAdmin();
