// Функция рендера списка комментариев
import {
  clearingFields,
  initAddComments,
  initAddLikesListenerForEnter,
  initAddLikesAndEditButtonListener,
} from './handlers.js';
import { name } from './api.js';

function renderAuthorizationPage({
  usersComments,
  handleFormSubmission,
  handleInput,
}) {
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
  <div class="edit hidden">
  <button class="edit-button edit-hidden" data-index="${index}" data-hidden="${
        user.isEdit
      }">Редактировать</button>
  <button class="edit-button-save edit-hidden" data-index="${index}" data-hidden="${!user.isEdit}">Сохранить</button>
</div>
</li>`;
    })
    .join('');

  const appHtml = `
  <div class="container">
    <ul class="comments">
      ${usersHtml}
    </ul>
    <div class="add-form">
      <input type="text" class="add-form-name add-form-input" placeholder="${name}" value="${name}" readonly/>
      <textarea type="textarea" class="add-form-text add-form-input" placeholder="Введите ваш коментарий" rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="add-form-button-delete">Удалить последний комментарий</button>
      </div>
    </div>
    <div class="comment-header add-form promise-add hidden" data-index="">
    Комментарий добавляется...
    </div>
</div>
`;

  const app = document.querySelector('.app');
  app.innerHTML = appHtml;

  const ulComments = document.querySelector('.comments');
  const buttonAddForm = document.querySelector('.add-form-button');
  const areaAddFormRow = document.querySelector('.add-form-text');
  // const inputAddFormRow = document.querySelector('.add-form-name');

  // handleFormSubmission({ areaAddFormRow, inputAddFormRow })
  clearingFields({ handleInput, areaAddFormRow, buttonAddForm });
  initAddComments({ buttonAddForm, handleFormSubmission });
  initAddLikesListenerForEnter({ handleFormSubmission });
  initAddLikesAndEditButtonListener({
    ulComments,
    usersComments,
    areaAddFormRow,
    handleInput,
    handleFormSubmission,
  });
}

export { renderAuthorizationPage };
