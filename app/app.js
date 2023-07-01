'use strict';

const usersComments = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    comment: 'Это будет первый комментарий на этой странице',
    isLike: false,
    count: 3,
    isEdit: false,
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    comment: 'Мне нравится как оформлена эта страница! ❤',
    isLike: true,
    count: 75,
    isEdit: false,
  },
];

const form = document.querySelector('.add-form');
const formInputs = document.querySelector('.add-form-input');
const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');

const buttonDeleteForm = document.querySelector('.add-form-button-delete');
const buttonAddForm = document.querySelector('.add-form-button');

const lastComment = document.querySelectorAll('.comment');
const ulComments = document.querySelector('.comments');
const myDate = new Date();

// const textarea = document.createElement('textarea');
// textarea.classList.add('area-edit');
// console.log(textarea)

const arrayInputs = [inputAddNameForm, areaAddFormRow];

// Функция даты, для добавления значения 0 перед числами < 10
const dateForComments = (date) => {
  let data = myDate.getDate();
  let month = myDate.getMonth();
  let hour = myDate.getHours();
  let minute = myDate.getMinutes();

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
  return `${data}.${month}.${myDate
    .getFullYear()
    .toString()
    .substr(-2)} ${hour}:${minute}`;
};

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
         <textarea class="comment-area-edit" type="textarea" name="edit-text "data-index="${index}">фвывфы</textarea>
        </div>
        <div class="comment-text edit-hidden" style="white-space: pre-line" data-hidden="${
          user.isEdit
        }" data-index="${index}">
          ${user.comment}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter" data-index="${index}" data-count="${
        user.count
      }">${user.count}</span>
          <button class="like-button" data-index="${index}" data-active-like="${
        user.isLike
      }"></button>
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
function appendComment(userName, userComment, userDate) {
  usersComments.push({
    name: userName,
    date: userDate,
    comment: userComment,
    isLike: false,
    count: 0,
    isEdit: false,
  });

  inputAddNameForm.value = '';
  areaAddFormRow.value = '';

  renderComments();
}
console.log(typeof usersComments);

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

// Вынесли отдельно код для обработчика событий
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
    : appendComment(inputValue, areaFormValue, dateForComments(myDate));
};

// Вешаем обработчик событий на кнопку add comment
buttonAddForm.addEventListener('click', handleFormSubmission);

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
      // Условное ветвление для отображеня изменений кнопки и счётчика
      if (usersComments[index].isLike === false) {
        usersComments[index].isLike = true;
        usersComments[index].count++;
        console.log(usersComments[index].isLike);
      } else {
        usersComments[index].isLike = false;
        usersComments[index].count--;
      }
      renderComments();
    }

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
        usersComments[index].comment = arrCommentsEditArea[index].innerText;
      }
      renderComments();
    }

    // Реализация ответа на комментарий
    if (target.closest('.comment-text')) {
      console.log(lastComment[index]);
      areaAddFormRow.value = `QUOTE_BEGIN > ${usersComments[index].name}
  ${usersComments[index].comment} QUOTE_END`;
      renderComments();
    }
  });
}
initAddLikesAndEditButtonListener();
