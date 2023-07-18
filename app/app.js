'use strict';
import { validateForm, handleInput } from './validate.js';
import { getTodo, postTodo } from './api.js';
import { renderMarkup, delay } from './render.js';
import { renderLogin } from './loginPage.js';
// import { initAddLikesAndEditButtonListener } from './hanlder.js';
const renderHtml = () => {
  return renderMarkup({usersComments, inputAddNameForm, areaAddFormRow, handleInput, initAddLikesListenerForEnter, handleFormSubmission});
}
 
let usersComments = [];

const form = document.querySelector('.add-form');
const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');

const promiseLoad = document.querySelector('.promise-load');
const promiseAdd = document.querySelector('.promise-add');


// Функция обработки при нажатии на кнопку "написать"
const handleFormSubmission = () => {
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
    ? validateForm()
    : appendComment(inputValue, areaFormValue);
};

// Вешаем обработчик событий на клавишу enter
function initAddLikesListenerForEnter() {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      handleFormSubmission();
    }
  });
}

// Запрос на сервер для получения данных комментариев
function getUsersComments() {
  getTodo()
    .then((response) => {
      usersComments = response;
      promiseLoad.classList.add('hidden');
      renderHtml();
    })
    .catch((error) => {
      console.log(error)
      alert(error.status);
    });
}
getUsersComments();

renderLogin();

// Создаём фунцию-генератор карточек
function appendComment(userName, userComment) {
  form.classList.toggle('hidden');
  promiseAdd.classList.toggle('hidden');

  postTodo(userName, userComment)
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error('Имя и комментарий должны быть не короче 3 символов');
      } else if (response.status === 401) {
          throw new Error('Пользователь не авторизован')
      } else {
        /*повторный запрос на сервер при ошибке 500 */
        appendComment(userName, userComment);
        throw new Error('Сервер сломался, попробуйте позже');
      }
    })
    .then(() => {
      return getUsersComments();
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
  renderHtml();
}


// initAddLikesAndEditButtonListener( { handleFormSubmission, usersComments, renderHtml } );
