// Функция рендера списка комментариев
const app = document.querySelector('.app');

function renderMarkup({
  usersComments,
  renderLogin,
  fetchPromiseWithAuthorization,
}) {
  const usersNoRegisterHtml = usersComments
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
    </li>
    `;
    })
    .join('');

  const appNoRegisterHtml = `  
  <div class="container">
<ul class="comments">
  ${usersNoRegisterHtml}
</ul>
<p class="add-text">Чтобы добавить комментарий, <button class="add-button">авторизуйтесь</button></p>
</div>`;

  app.innerHTML = appNoRegisterHtml;
  
  const buttonAuthorization = document.querySelector('.add-button');

  // Слушатель событий на кнопке авторизоваться
  buttonAuthorization.addEventListener('click', () => {
    console.log('click');
    renderLogin({ fetchPromiseWithAuthorization });
  });
}

export { renderMarkup };
