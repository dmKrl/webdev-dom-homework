'use strict';
import { validateForm, handleInput } from './validate.js';
import { getTodo, postTodo } from './api.js';
import { renderMarkup, delay } from './render.js';


let usersComments = [];

const form = document.querySelector('.add-form');
const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');

const buttonDeleteForm = document.querySelector('.add-form-button-delete');
const buttonAddForm = document.querySelector('.add-form-button');
const ulComments = document.querySelector('.comments');

const promiseLoad = document.querySelector('.promise-load');
const promiseAdd = document.querySelector('.promise-add');


// Запрос на сервер для получения данных комментариев
function getUsersComments() {
  getTodo()
    .then((response) => {
      usersComments = response;
      promiseLoad.classList.add('hidden');
      renderComments();
    })
    .catch((error) => {
      alert('Произошла ошибка, попробуйте повторить позже');
    });
}
getUsersComments();

// Функция рендера списка комментариев
const renderComments = () => {
  const usersHtml = usersComments
    .map((user, index) => {
      return renderMarkup(user, index)
    })
    .join('');

  ulComments.innerHTML = usersHtml;

  // Обработчики событий на наличие данных в input
  inputAddNameForm.addEventListener('input', handleInput);
  areaAddFormRow.addEventListener('input', handleInput);

  inputAddNameForm.classList.remove('error');
  areaAddFormRow.classList.remove('error');

  initAddLikesListenerForEnter();
};
renderComments();

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
  renderComments();
}

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

// Вешаем обработчик событий на кнопку add comment
buttonAddForm.addEventListener('click', () => {
  handleFormSubmission();
});

// Вешаем обработчик событий на клавишу enter
function initAddLikesListenerForEnter() {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      handleFormSubmission();
    }
  });
}

// Вешаем обработчик событий на кнопку delete comment
buttonDeleteForm.addEventListener('click', () => {
  const liEnd = ulComments.children[ulComments.children.length - 1];
});

// Функция изменения кнопки лайка и редактирования комментария
function initAddLikesAndEditButtonListener() {
  const textCommentsEditArea = document.querySelectorAll('.comment-area-edit');
  const arrCommentsEditArea = Array.from(textCommentsEditArea);

  // Слушатель события на список, поиск тригера(делегирование)
  ulComments.addEventListener('click', function (event) {
    const target = event.target;
    const index = target.dataset.index;

    // Проверка на таргет кнопки лайка
    if (target.closest('.like-button')) {
      usersComments[index].isLikeLoading = true;
      renderComments();
      // Условное ветвление для отображеня изменений кнопки и счётчика
      delay(2000).then(() => {
        usersComments[index].likes = usersComments[index].isLiked
          ? usersComments[index].likes - 1
          : usersComments[index].likes + 1;
        usersComments[index].isLiked = !usersComments[index].isLiked;
        usersComments[index].isLikeLoading = false;
        renderComments();
      });
    }

    // Проверка на таргет кнопки редактировать и сохранить
    if (target.closest('.edit-button') || target.closest('.edit-button-save')) {
      // Изменение кнопки в зависимости от состояния inputa
      if (usersComments[index].isEdit === false) {
        usersComments[index].isEdit = true;
      } else {
        usersComments[index].isEdit = false;
        usersComments[index].comment = arrCommentsEditArea[index].value;
      }
      renderComments();
    }

    // Реализация ответа на комментарий
    if (target.closest('.comment-text')) {
      areaAddFormRow.value = `QUOTE_BEGIN > ${usersComments[index].name}
  ${usersComments[index].text} QUOTE_END`;
      renderComments();
    }
  });
}
initAddLikesAndEditButtonListener();
