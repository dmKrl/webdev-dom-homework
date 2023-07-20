'use strict';
import { validateForm, handleInput } from './validate.js';
import { getTodo, postTodo, getTodoWithAuthorization } from './api.js';
import { renderAuthorizationPage } from './render.js';
import { renderMarkup, delay } from './renderMarkup.js';
import { renderLogin } from './loginPage.js';

let usersComments = [];

const form = document.querySelector('.add-form');
const container = document.querySelector('.container');

const promiseLoad = document.querySelector('.promise-load');
const promiseAdd = document.querySelector('.promise-add');

// Запрос на сервер для получения данных комментариев без авторизации
function getUsersComments() {
  getTodo()
    .then((response) => {
      console.log(response);
      usersComments = response;
      promiseLoad.classList.add('hidden');
      renderMarkup({
        usersComments,
        renderLogin,
        fetchPromiseWithAuthorization,
        container,
      });
    })
    .catch((error) => {
      console.log(error);
      alert('Произошла ошибка, попробуйте повторить позже');
    });
}
// Отображение списка комментариев на экране неавторизованному пользователю
getUsersComments();

// Запрос на сервер для получения данных комментариев с авторизацией
function fetchPromiseWithAuthorization() {
  getTodoWithAuthorization()
    .then((response) => {
      console.log(response);
      usersComments = response;
      promiseLoad.classList.add('hidden');
      renderAuthorizationPage({
        usersComments,
        handleFormSubmission,
        delay,
        handleInput,
      });
    })
    .catch((error) => {
      console.log(error);
      alert('Произошла ошибка, попробуйте повторить позже');
    });
}

// Создаём фунцию-генератор карточек
function appendComment(userName, userComment) {
  const areaAddFormRow = document.querySelector('.add-form-text');
  const inputAddNameForm = document.querySelector('.add-form-name');
  form.classList.toggle('hidden');
  promiseAdd.classList.toggle('hidden');

  postTodo(userName, userComment)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error('Вы не авторизованы');
      } else if (response.status === 400) {
        throw new Error('Имя и комментарий должны быть не короче 3 символов');
      } else {
        /*повторный запрос на сервер при ошибке 500 */
        appendComment(userName, userComment);
        throw new Error('Сервер сломался, попробуйте позже');
      }
    })
    .then(() => {
      return fetchPromiseWithAuthorization();
    })
    .then(() => {
      form.classList.toggle('hidden');
      promiseAdd.classList.toggle('hidden');
      inputAddNameForm.value = '';
      areaAddFormRow.value = '';
    })
    .catch((error) => {
      if (
        error.message !== 'Failed to fetch'
          ? alert(`${error.message}`)
          : alert('Кажется, у вас сломался интернет, попробуйте позже')
      );
      form.classList.toggle('hidden');
      promiseAdd.classList.toggle('hidden');
    });
    renderAuthorizationPage({ usersComments, handleFormSubmission, delay, handleInput });
}

// Функция обработки при нажатии на кнопку "написать"
function handleFormSubmission() {
  const inputAddNameForm = document.querySelector('.add-form-name');
  const areaAddFormRow = document.querySelector('.add-form-text');
  const inputValue = inputAddNameForm.value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  const areaFormValue = areaAddFormRow.value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('QUOTE_BEGIN', "<div class='quote'>")
    .replaceAll('QUOTE_END', '</div>');
  inputValue === '' || areaFormValue === ''
    ? validateForm(inputValue, areaAddFormRow)
    : appendComment(inputValue, areaFormValue);
}
