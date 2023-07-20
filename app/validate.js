const inputAddNameForm = document.querySelector('.add-form-name');
const areaAddFormRow = document.querySelector('.add-form-text');
const buttonAddForm = document.querySelector('.add-form-button');
const arrayInputs = [inputAddNameForm, areaAddFormRow];

// Валидация
function validateForm(inputAddNameForm, areaAddFormRow) {
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

export { validateForm, handleInput };
