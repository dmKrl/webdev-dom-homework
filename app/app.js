'use strict';

let usersComments = [];

const form = document.querySelector('.add-form');
const formInputs = document.querySelector('.add-form-input');
const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');

const buttonDeleteForm = document.querySelector('.add-form-button-delete');
const buttonAddForm = document.querySelector('.add-form-button');

const lastComment = document.querySelectorAll('.comment');
const ulComments = document.querySelector('.comments');

const promiseLoad = document.querySelector('.promise-load');
const promiseAdd = document.querySelector('.promise-add');

let myDate = new Date();

const arrayInputs = [inputAddNameForm, areaAddFormRow];

// Функция даты, для добавления значения 0 перед числами < 10
const dateForComments = (date) => {
  let data = date.getDate();
  let month = date.getMonth();
  let hour = date.getHours();
  let minute = date.getMinutes();

  if (data < 10) {
    data = '0' + data;
  }
  if (month < 10) {
    month = '0' + (month + 1);
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  return `${data}.${month}.${date
    .getFullYear()
    .toString()
    .substr(-2)} ${hour}:${minute}`;
};

// Запрос на сервер для получения данных комментариев
function getUsersComments() {
  const url = `https://wedev-api.sky.pro/api/v1/kralichkin-dmitry/comments`;

  return fetch(url, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      return responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: dateForComments(new Date(comment.date)),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: false,
          id: comment.id,
        };
      });
    })
    .then((response) => {
      usersComments = response;
      promiseLoad.classList.add('hidden');
      console.log(usersComments);
      renderComments();
    });
}
getUsersComments();

// Имитация обработки кнопки лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Функция рендера списка комментариев
const renderComments = () => {
  const usersHtml = usersComments
    .map((user, index) => {
      return `
      <li class="comment">
      <div class="comment-header" data-index="${index}">
        <div>${user.name}</div>
        <div>${user.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-area edit-hidden" data-hidden="${!user.isEdit}">
         <textarea class="comment-area-edit" type="textarea" name="edit-text "data-index="${index}">${
        user.text
      }</textarea>
        </div>
        <div class="comment-text edit-hidden" style="white-space: pre-line" data-hidden="${
          user.isEdit
        }" data-index="${index}">
          ${user.text}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter" data-index="${index}" data-count="${
        user.likes
      }">${user.likes}</span>
          <button class="like-button" data-index="${index}"  data-active-like="${
        user.isLiked
      }" data-is-like-loading="${user.isLikeLoading}"></button>
        </div>
      </div>
      <div class="edit">
      <button class="edit-button edit-hidden" data-index="${index}" data-hidden="${
        user.isEdit
      }">Редактировать</button>
      <button class="edit-button-save edit-hidden" data-index="${index}" data-hidden="${!user.isEdit}">Сохранить</button>
    </div>
    </li>`;
    })
    .join('');

  ulComments.innerHTML = usersHtml;

  // Обработчики событий на наличие данных в input
  inputAddNameForm.addEventListener('input', handleInput);
  areaAddFormRow.addEventListener('input', handleInput);

  inputAddNameForm.classList.remove('error');
  areaAddFormRow.classList.remove('error');

  // initAddLikesAndEditButtonListener()

  initAddLikesListenerForEnter();
};
renderComments();

// Создаём фунцию-генератор карточек
function appendComment(userName, userComment) {
  const url = `https://wedev-api.sky.pro/api/v1/kralichkin-dmitry/comments`;

  form.classList.toggle('hidden');
  promiseAdd.classList.toggle('hidden');
  // Отправляем запрос за публикацию карточки в массив
  const fetchPromise = fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      text: userComment,
      name: userName,
      isLikeLoading: false,
    }),
  })
    .then(() => {
      return getUsersComments();
    })
    .then(() => {
      form.classList.toggle('hidden');
      promiseAdd.classList.toggle('hidden');
      inputAddNameForm.value = '';
      areaAddFormRow.value = '';
    });
  renderComments();
}

// Валидация
function validateForm() {
  if (inputAddNameForm.value === '') {
    inputAddNameForm.classList.add('error');
  }
  if (areaAddFormRow.value === '') {
    areaAddFormRow.classList.add('error');
  }
}

// Функция отключения активности кнопки при пустом input
function handleInput() {
  buttonAddForm.disabled = arrayInputs.some((input) => !input.value.length);
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
  console.log(liEnd.remove());
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
    console.log(usersComments[index].isLikeLoading);

    // Проверка на таргет кнопки редактировать и сохранить
    if (target.closest('.edit-button') || target.closest('.edit-button-save')) {
      console.log(usersComments[index].isEdit);

      // Изменение кнопки в зависимости от состояния inputa
      if (usersComments[index].isEdit === false) {
        console.log(usersComments[index]);
        usersComments[index].isEdit = true;
      } else {
        console.log(usersComments[index].comment);
        usersComments[index].isEdit = false;
        console.log(arrCommentsEditArea[index]);
        usersComments[index].comment = arrCommentsEditArea[index].value;
      }
      renderComments();
    }

    // Реализация ответа на комментарий
    if (target.closest('.comment-text')) {
      console.log(lastComment[index]);
      areaAddFormRow.value = `QUOTE_BEGIN > ${usersComments[index].name}
  ${usersComments[index].text} QUOTE_END`;
      renderComments();
    }
  });
}
initAddLikesAndEditButtonListener();
