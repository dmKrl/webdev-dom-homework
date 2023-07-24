// Валидация
function validateForm(areaAddFormRow) {
  if (areaAddFormRow.value === '') {
    areaAddFormRow.classList.add('error');
  }
}

// Функция отключения активности кнопки при пустом input
function handleInput({buttonAddForm, areaAddFormRow}) {
  buttonAddForm.disabled === !areaAddFormRow.value.length;
}

export { validateForm, handleInput };
