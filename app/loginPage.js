import { login, setToken } from './api.js';


const renderLogin = () => {
  const appElement = document.querySelector('.app');
  const loginHtml = `
<div class="container">
<form class="add-form">
  <input type="login" class="add-form-text add-form-input add-form-login" placeholder="Введите логин" />
  <input type="password" class="add-form-text add-form-input add-form-password" placeholder="Введите пароль" rows="4"></input>
  <div class="add-form-authorization">
    <button class="add-form-button-enter">Войти</button>
    <a class="add-form-button-register">Зарегистрироваться</a>
  </div>
</form>
</div>
`;
appElement.innerHTML = loginHtml;

const buttonLogin = document.querySelector('.add-form-button-enter');
const loginInputElement = document.querySelector('.add-form-login');
const passwordInputElement = document.querySelector('.add-form-password');

buttonLogin.addEventListener('click', () => {
  login({
    login: loginInputElement.value,
    password: passwordInputElement.value,
  }).then((responseData) => {
    setToken(responseData.user.token);
    console.log(responseData);
  });
});

};

export { renderLogin }