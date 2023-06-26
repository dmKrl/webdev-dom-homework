"use strict";

const usersComments = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    comment: 'Это будет первый комментарий на этой странице',
    isLike: false,
    count: 3

  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    comment: 'Мне нравится как оформлена эта страница! ❤',
    isLike: true,
    count: 75
  }
]



const form = document.querySelector('.add-form');
const formInputs = document.querySelector('.add-form-input')
const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');

const buttonDeleteForm = document.querySelector('.add-form-button-delete');
const buttonAddForm = document.querySelector('.add-form-button');

const lastComment = document.querySelectorAll('.comment');
const ulComments = document.querySelector('.comments');
const myDate = new Date();


const arrayInputs = [inputAddNameForm, areaAddFormRow]


// Функция даты, для добавления значения 0 перед числами < 10
const dateForComments = (date) => {
  let data = myDate.getDate();
  let month = myDate.getMonth();
  let hour = myDate.getHours();
  let minute = myDate.getMinutes();

  if (data < 10) {
    data = "0" + data;
  }
  if (month < 10) {
    month = "0" + (month + 1);
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return `${data}.${month}.${myDate.getFullYear().toString().substr(-2)} ${hour}:${minute}`;
}



// Функция рендера списка комментариев
const renderComments = () => {
  const usersHtml = usersComments
    .map((user, index) => {
      return `
      <li class="comment">
      <div class="comment-header">
        <div>${user.name}</div>
        <div>${user.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">
          ${user.comment}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter" data-index="${index}" data-count="${user.count}" value="${user.count}">${user.count}</span>
          <button class="like-button" data-index="${index}" data-active-like="${user.isLike}"></button>
        </div>
      </div>
    </li>`
    })
    .join('');

  ulComments.innerHTML = usersHtml;

  inputAddNameForm.value = '';
  areaAddFormRow.value = '';

  inputAddNameForm.classList.remove('error');
  areaAddFormRow.classList.remove('error');

  initAddLikesListener()
  initAddLikesListenerForEnter();
}
renderComments();



// Создаём фунцию-генератор карточек
function appendComment(userName, userComment, userDate) {
  usersComments.push({
    name: userName,
    date: userDate,
    comment: userComment,
    isLike: false,
    count: 0

  })
  renderComments();
}
console.log(typeof usersComments)



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
  buttonAddForm.disabled = arrayInputs.some(input => !input.value.length);
}



// Обработчики событий на наличие данных в input
inputAddNameForm.addEventListener('input', handleInput);
areaAddFormRow.addEventListener('input', handleInput);



// Вынесли отдельно код для обработчика событий
const handleFormSubmission = () => {
  const inputValue = inputAddNameForm.value;
  const areaFormValue = areaAddFormRow.value;

  inputValue === '' || areaFormValue === ''
    ? validateForm()
    : appendComment(inputValue, areaFormValue, dateForComments(myDate));
}



// Вешаем обработчик событий на кнопку add comment
buttonAddForm.addEventListener('click', handleFormSubmission);



// Вешаем обработчик событий на клавишу enter
function initAddLikesListenerForEnter() {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      handleFormSubmission();
    }
  })
}



// Вешаем обработчик событий на кнопку delete comment
  buttonDeleteForm.addEventListener('click', () => {
    const liEnd = ulComments.children[ulComments.children.length - 1];
    console.log(liEnd.remove());
  })
  renderComments();



// // Функция обработчика кликов по кнопке лайк
// let counter = document.querySelectorAll('span')
function initAddLikesListener() {
  const likesButton = document.querySelectorAll('.like-button');

// Перебираем кнопки из коллекции
  for (const likeButton of likesButton) {
// Вызываем слушатель событий для каждой кнопки
    likeButton.addEventListener('click', () => {
      // Обозначаем элемент span
      const likesCounterElement = likeButton.previousElementSibling;
      const likesCounter = parseInt(likesCounterElement.textContent);

      // Условное ветвление для отображеня изменений кнопки и счётчика
      if (likeButton.dataset.activeLike === 'false') {
        likeButton.dataset.activeLike = 'true'
        likesCounterElement.dataset.count++
        likesCounterElement.textContent = likesCounter + 1;
        
      } else {
        likeButton.dataset.activeLike = 'false'
        likesCounterElement.dataset.count--
        likesCounterElement.textContent = likesCounter - 1;
      }
      
      
            // const index = likesCounterElement.dataset.index;
            // console.log(usersComments.find(item => item === index))
    })
    }
  }