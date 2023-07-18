// Функция рендера списка комментариев

const renderMarkup = ({
  usersComments,
  inputAddNameForm,
  areaAddFormRow,
  handleInput,
  initAddLikesListenerForEnter,
  handleFormSubmission,
}) => {
  const appElement = document.querySelector('.app');

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
  const appHtml = `
  <div class="container">
  <ul class="comments">
    ${usersHtml}
  </ul>
  <div class="add-form">
    <input
      type="text"
      class="add-form-name add-form-input"
      placeholder="Введите ваше имя"
    />
    <textarea
      type="textarea"
      class="add-form-text add-form-input"
      placeholder="Введите ваш коментарий"
      rows="4"
    ></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
      <button class="add-form-button-delete">
        Удалить последний комментарий
      </button>
    </div>
  </div>
</div>`;
  appElement.innerHTML = appHtml;

  // inputName.addEventListener('input', handleInput);
  // areaName.addEventListener('input', handleInput);

  // inputName.classList.remove('error');
  // areaName.classList.remove('error');
  const buttonAddForm = document.querySelector('.add-form-button');

  // Вешаем обработчик событий на кнопку add comment
  buttonAddForm.addEventListener('click', () => {
    handleFormSubmission();
  });

  initAddLikesListenerForEnter();
};

// Имитация обработки кнопки лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
export { renderMarkup, delay };
