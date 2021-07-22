import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import UserAndCars from './models/userAndCarsModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`.blue.underline.bold);
    // Starting server
    app.listen(PORT, () =>
      console.log(`Serer is running on port ${PORT}...`.yellow.underline.bold)
    );
  });

// Routes
app.get('/', (req, res) => res.send('API is running...'));

// GET: all cars
app.get('/api/cars', (req, res) => {
  UserAndCars.find({}).then((data) => res.json(data));
});

//GET: get single user based on id
app.get('/api/users/:id', (req, res) => {
  let userId = req.params.id;

  UserAndCars.findById(userId).then((result) => {
    res.json(result);
  });
});

// POST: register new user
app.post('/api/users/signup', (req, res) => {
  let user = req.body;

  UserAndCars.find().then((result) => {
    const userExists = result.some(
      (userFromDB) => userFromDB.email === user.email
    );

    if (userExists) {
      res.json({
        registrationStatus: 'failed',
        message: 'User with given email already exists',
      });
    } else {
      user.cars = [];

      const newUser = new UserAndCars(user);

      newUser.save().then((result) => {
        let { _id } = result;
        res.json({
          registrationStatus: 'success',
          userId: { _id },
        });
      });
    }
  });
});

//POST : Log in existing user
app.post('/api/users/login', (req, res) => {
  let user = req.body;

  UserAndCars.find().then((result) => {
    console.log(result);
    let userFounded = result.find(
      (userFromDB) =>
        userFromDB.email === user.email && userFromDB.password === user.password
    );
    if (userFounded) {
      let { _id } = userFounded;

      res.json({
        loginStatus: 'success',
        userId: _id,
      });
    } else {
      res.status(401).json({
        loginStatus: 'Failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
});
// REST API
/*
GET:   /api/cars'     ||GET all cars
      

POST:  /api/users/signup     | REGISTER new user
       /api/users/login      | LOG in existing user  
*/
