// Imports
import { REGISTER_USER_URI } from '../modules/endpoints/endpoints.js';

// --- LOGIN ---
//--------------

// Variables
// -- DOM emelemts

// Funtions

// Events

// --- SIGNUP ---
//---------------

// Variables
// -- DOM emelemts
const signUpFormElement = document.querySelector('#signUpForm');
const signUpMessageElement = document.querySelector('#signUpMessage');

// Funtions
const signUpUser = (e) => {
  e.preventDefault();

  // -- validating is passwords match
  if (e.target.signUpPassword.value !== e.target.signUpConfirmPassword.value) {
    signUpMessageElement.classList.remove('hidden');
    signUpMessageElement.innerText = 'Passwords do not match';

    e.target.signUpConfirmPassword.value = '';
    e.target.signUpPassword.value = '';
    return;
  }

  let user = {
    name: e.target.signUpName.value,
    surname: e.target.signUpSurname.value,
    email: e.target.signUpEmail.value,
    password: e.target.signUpPassword.value,
  };

  // SENDING TO API ("/api/login")
  return fetch(REGISTER_USER_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.registrationStatus === 'failed') {
        e.target.signUpConfirmPassword.value = '';
        e.target.signUpPassword.value = '';
        e.target.signUpEmail.value = '';

        e.target.signUpEmail.focus();

        signUpMessageElement.classList.remove('hidden');
        signUpMessageElement.innerText = data.message;
      } else if (data.registrationStatus === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));

        location.href =
          'http://127.0.0.1:5500/1_frontend/pages/my-account.html';
      }
    });
};

// Events
signUpFormElement.addEventListener('submit', signUpUser);
