"use strict";
// Код писать здесь
// console.log("It works!");

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
console.log(arrayInputs);
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
  if (hour < 10) {
    hour = "0" + hour;
  }
  return `${data}.${month}.${myDate.getFullYear().toString().substr(-2)} ${hour}:${minute}`;
}


// Создаём фунцию-генератор карточек
function createCard(name, comment, date) {
  const htmlCard = `        
      <li class="comment">
        <div class="comment-header">
          <div>${name}</div>
          <div>${date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${comment}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">0</span>
            <button class="like-button"></button>
          </div>
        </div>
      </li>`

  const liEnd = ulComments.children[ulComments.children.length - 1]
  console.log(liEnd)
  liEnd.insertAdjacentHTML('afterend', htmlCard);

  inputAddNameForm.value = '';
  areaAddFormRow.value = '';

  inputAddNameForm.classList.remove('error');
  areaAddFormRow.classList.remove('error');

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
  buttonAddForm.disabled = arrayInputs.some(input => !input.value.length);
}


// Обработчики событий на наличие данных в input
inputAddNameForm.addEventListener('change', handleInput);
areaAddFormRow.addEventListener('change', handleInput);


// Вынесли отдельно код для обработчика событий
const handleFormSubmission = () => {
    const inputValue = inputAddNameForm.value;
    const areaFormValue = areaAddFormRow.value;
  
    inputValue === '' || areaFormValue === ''
      ? validateForm()
      : createCard(inputValue, areaFormValue, dateForComments(myDate));
}


// Вешаем обработчик событий на кнопку add comment
buttonAddForm.addEventListener('click', handleFormSubmission)


// Вешаем обработчик событий на клавишу enter
document.addEventListener('keyup', (event) => {
  if (event.code === 'Enter') {
    handleFormSubmission
 }
})


// Вешаем обработчик событий на кнопку delete comment
buttonDeleteForm.addEventListener('click', () => {
    const liEnd = ulComments.children[ulComments.children.length - 1]
    console.log(liEnd.remove())
  })
  