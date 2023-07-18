const buttonDeleteForm = document.querySelector('.add-form-button-delete');
const ulComments = document.querySelector('.comments');


// Функция изменения кнопки лайка и редактирования комментария
function initAddLikesAndEditButtonListener({ usersComments, renderMarkup }) {
  const textCommentsEditArea = document.querySelectorAll('.comment-area-edit');
  const arrCommentsEditArea = Array.from(textCommentsEditArea);

  // Вешаем обработчик событий на кнопку delete comment
  buttonDeleteForm.addEventListener('click', () => {
    const liEnd = ulComments.children[ulComments.children.length - 1];
  });

  // Слушатель события на список, поиск тригера(делегирование)
  ulComments.addEventListener('click', function (event) {
    const target = event.target;
    const index = target.dataset.index;

    // Проверка на таргет кнопки лайка
    if (target.closest('.like-button')) {
      usersComments[index].isLikeLoading = true;
      renderMarkup();
      // Условное ветвление для отображеня изменений кнопки и счётчика
      delay(2000).then(() => {
        usersComments[index].likes = usersComments[index].isLiked
          ? usersComments[index].likes - 1
          : usersComments[index].likes + 1;
        usersComments[index].isLiked = !usersComments[index].isLiked;
        usersComments[index].isLikeLoading = false;
        renderMarkup();
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
      renderMarkup();
    }

    // Реализация ответа на комментарий
    if (target.closest('.comment-text')) {
      areaAddFormRow.value = `QUOTE_BEGIN > ${usersComments[index].name}
    ${usersComments[index].text} QUOTE_END`;
      renderMarkup();
    }
  });
}


// export { initAddLikesAndEditButtonListener }

