//import

import {
  GET_USER_URI,
  DELEETE_CAR_UR,
  ADD_CAR_UR,
} from '../modules/endpoints/endpoints.js';

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

  // console.log(userData.cars.length);

  userInfoElement.innerHTML = `
  <div>
  <i class="far fa-user fa-2x"></i>
  </div>
  <h3>${userData.name} ${userData.surname}</h3>
  <p>${userData.email}</p>
  <p>Cars for sale: ${userData.cars.length}</p>
  <button class="btn-primary" id="logoutUser">Log Out</button>
  `;

  const logoutUserBtn = document.querySelector('#logoutUser');

  logoutUserBtn.addEventListener('click', logoutUser);
};

//--logout user
const logoutUser = () => {
  localStorage.removeItem('user');

  location.href = 'http://127.0.0.1:5500/1_frontend/index.html';
};
//Events
document.addEventListener('DOMContentLoaded', getUser);

//-----USER CARS INFO----
//--------------------
//Variables
const userCarsListElement = document.querySelector('#user__cars-list');
const addNewCarFormElement = document.querySelector('#addNewCarForm');
const addCarForSaleMessageElement = document.querySelector(
  '#addCarForSaleMessage'
);

//Functions
//--show user cars for sale
const showCars = (userData) => {
  console.log(userData);
  if (userData.cars.length) {
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
      <td><button class="btn-primary btn-delete-car" data-user-id="${userData._id}"data-car-id="${item._id}">Delete</button></td>
      </tr>`;

    return total;
  }, '')}

      </tbody>
  </table>
  `;

    const deleteCarBtns = document.querySelectorAll('.btn-delete-car');

    deleteCarBtns.forEach((btn) => btn.addEventListener('click', deleteCar));
  } else {
    userCarsListElement.innerHTML = `<p>Currently You have ${userData.cars.length} cars for sale</p>`;
  }
};

//--delete
const deleteCar = (e) => {
  // console.log(e.target);
  // console.log(e.target.dataset);

  let carToDelete = {
    userId: e.target.dataset.userId,
    ccarId: e.target.dataset.carId,
  };
  // console.log(carToDelete);

  return fetch(DELEETE_CAR_UR + carToDelete.userId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carToDelete),
  })
    .then((res) => res.json())
    .then((data) => {
      showUser(data);
      showCars(data);
    });
};

//--add car
const addCar = (e) => {
  e.preventDefault();

  let userId = JSON.parse(localStorage.getItem('user'));

  let car = {
    make: e.target.carMake.value,
    model: e.target.carModel.value,
    year: +e.target.carYear.value,
    price: +e.target.carPrice.value,
  };

  return fetch(ADD_CAR_UR + userId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  })
    .then((res) => res.json())
    .then((data) => {
      showUser(data);
      showCars(data);

      addCarForSaleMessageElement.classList.remove('hidden');
      addCarForSaleMessageElement.innerHTML = 'New Car Added';
    });
};
//events
addNewCarFormElement.addEventListener('submit', addCar);
