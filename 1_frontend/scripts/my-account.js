//import
import { GET_USER_URI } from '../modules/endpoints/endpoints.js';

//----USER INFO-----
//----------------
//Variables
const serNameElement = document.querySelector('#user-name');
const userInfoContainerElement = document.querySelector('#user-info-container');

//Functions
//--get user data
const getUser = () => {
  let userFromLocalStorageId = JSON.parse(localStorage.getItem('user'));

  if (userFromLocalStorageId) {
    return fetch(GET_USER_URI + userFromLocalStorageId)
      .then((res) => res.json())
      .then((data) => console.log(data));
  } else {
    location.href = 'http://127.0.0.1:5500/1_frontend/pages/login.html';
  }
};

//--show user data

//Events
document.addEventListener('DOMContentLoaded', getUser);
//-----USER CARS INFO----
//--------------------
//Variables
const userCarsContainerElement = document.querySelector('#user-cars-container');
//Functions

//Events
