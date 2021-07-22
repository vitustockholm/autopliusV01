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
        let { _id, name, surname, email, cars } = result;
        res.json({
          registrationStatus: 'success',
          user: { _id, name, surname, email, cars },
        });
      });
    }
  });
});

app.post('/api/users/login', (req, res) => {
  let user = req.body;
});
// REST API
/*
GET:   /api/cars'     ||GET all cars
      

POST:  /api/users/signup     | REGISTER new user
       /api/users/login      | LOG in existing user  
*/
