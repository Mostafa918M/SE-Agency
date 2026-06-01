const mongoose = require('mongoose');
const chalk = require('chalk');

/**
 * Connect to MongoDB using the DATABASE_URL environment variable.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/se_agency');
    console.log(chalk.cyan.underline.bold(`MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
