// Имитация обработки кнопки лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Обработчики событий на наличие данных в input
function clearingFields({ handleInput, areaAddFormRow, buttonAddForm }) {
  areaAddFormRow.addEventListener('input', handleInput({buttonAddForm, areaAddFormRow}));

  areaAddFormRow.classList.remove('error');
}

// Вешаем обработчик событий на кнопку add comment
function initAddComments({ buttonAddForm, handleFormSubmission }) {
  buttonAddForm.addEventListener('click', () => {
    handleFormSubmission();
  });
}

// Вешаем обработчик событий на клавишу enter
function initAddLikesListenerForEnter({ handleFormSubmission }) {
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      handleFormSubmission();
    }
  });
}

//   // Вешаем обработчик событий на кнопку delete comment
//   buttonDeleteForm.addEventListener('click', () => {
//     const liEnd = ulComments.children[ulComments.children.length - 1];
//   });

// Функция изменения кнопки лайка и редактирования комментария
function initAddLikesAndEditButtonListener({
  ulComments,
  usersComments,
  areaAddFormRow,
}) {
  const textCommentsEditArea = document.querySelectorAll('.comment-area-edit');
  const arrCommentsEditArea = Array.from(textCommentsEditArea);

  // Слушатель события на список, поиск тригера(делегирование)
  ulComments.addEventListener('click', function (event) {
    const target = event.target;
    const index = target.dataset.index;

    // Проверка на таргет кнопки лайка
    if (target.closest('.like-button')) {
      usersComments[index].isLikeLoading = true;
      console.log('click')
      // Условное ветвление для отображеня изменений кнопки и счётчика
      delay(2000).then(() => {
        console.log(usersComments[index])
        usersComments[index].likes = usersComments[index].isLiked
          ? usersComments[index].likes - 1
          : usersComments[index].likes + 1;
        usersComments[index].isLiked = !usersComments[index].isLiked;
        usersComments[index].isLikeLoading = false;
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
    }

    // Реализация ответа на комментарий
    if (target.closest('.comment-text')) {
      areaAddFormRow.value = `QUOTE_BEGIN > ${usersComments[index].name}
  ${usersComments[index].text} QUOTE_END`;

    }
  });
}

export {
  initAddLikesAndEditButtonListener,
  initAddLikesListenerForEnter,
  initAddComments,
  clearingFields,
};
