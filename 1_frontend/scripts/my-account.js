//import

import { GET_USER_URI } from '../modules/endpoints/endpoints.js';

//----USER INFO-----
//----------------
//Variables
const userNameElement = document.querySelector('#user-name');
const userInfoElement = document.querySelector('#user__info');

//Functions
//--get user data
const getUser = () => {
  let userFromLocalStorageId = JSON.parse(localStorage.getItem('user'));

  if (userFromLocalStorageId) {
    return fetch(GET_USER_URI + userFromLocalStorageId)
      .then((res) => res.json())
      .then((data) => {
        showUser(data);
        showCars(data);
      });
  } else {
    location.href = 'http://127.0.0.1:5500/1_frontend/pages/login.html';
  }
};

//--show user data
const showUser = (userData) => {
  userNameElement.innerText = userData.name;

  userInfoElement.innerHTML = `
  <div>
  <i class="far fa-user fa-2x"></i>
  </div>
  <h3>${userData.name} ${userData.surname}</h3>
  <p>${userData.email}</p>
  <p>Cars for sale: ${userData.cars.length}</p>
  <button class="btn-primary">Log Out</button>
  `;
};

//Events
document.addEventListener('DOMContentLoaded', getUser);
//-----USER CARS INFO----
//--------------------
//Variables
const userCarsListElement = document.querySelector('#user__cars-list');

//Functions
//--show user cars for sale
const showCars = (userData) => {
  userCarsListElement.innerHTML = `
    <table>
    <thead>
    <tr>
    <th>Make</th>
    <th>Model</th>
    <th>Year</th>
    <th>Price</th>
    <th>Action</th>
    </tr>
    </thead>
    <tbody>
    ${userData.cars.reduce((total, item) => {
      total += `<tr>
        <td>${item.make}</td>
        <td>${item.model}</td>
        <td>${item.year}</td>
        <td>$${item.price}</td>
        <td><button class="btn-primary">Delete</button></td>
        </tr>`;
      return total;
    }, '')}
        </tbody>
    </table>
    `;
};

//Events
