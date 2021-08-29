/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const fs = require('fs');
const Tour = require('./models/tourModel');
const User = require('./models/userModel')
const Review = require('./models/reviewModel')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((con) => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users,{validateBeforeSave:false});
    await Review.create(reviews);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
