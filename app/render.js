// Функция рендера списка комментариев

function renderMarkup(user, index, userComment, initAddLikesAndEditButtonListener) {
  const commentsHtml = `
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

  const appHtml = `
  <div class="container">
    <ul class="comments">
      ${commentsHtml}
    </ul>
    <p class="add-text">Чтобы добавить комментарий, <button class="add-button">авторизуйтесь</button></p>
    <div class="add-form">
      <input type="text" class="add-form-name add-form-input" placeholder="Введите ваше имя" />
      <textarea type="textarea" class="add-form-text add-form-input" placeholder="Введите ваш коментарий" rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
        <button class="add-form-button-delete">Удалить последний комментарий</button>
      </div>
    </div>
  </div>`;
  const form = document.querySelector('.add-form');
  const inputAddNameForm = document.querySelector('.add-form-name');
  const areaAddFormRow = document.querySelector('.add-form-text');

  const buttonDeleteForm = document.querySelector('.add-form-button-delete');
  const buttonAddForm = document.querySelector('.add-form-button');
  const ulComments = document.querySelector('.comments');

  const usersHtml = usersComments
    .map((user, index) => {
      return renderMarkup(user, index);
    })
    .join('');

  ulComments.innerHTML = usersHtml;

  // Обработчики событий на наличие данных в input
  inputAddNameForm.addEventListener('input', handleInput);
  areaAddFormRow.addEventListener('input', handleInput);

  inputAddNameForm.classList.remove('error');
  areaAddFormRow.classList.remove('error');

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

buttonAuthorization.addEventListener('click', () => {
  console.log('click')
  renderLogin();
})


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
}

// Имитация обработки кнопки лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
export { renderMarkup, delay };
