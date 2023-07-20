import { login, setToken } from './api.js';

const renderRegister = () => {
  const appElement = document.querySelector('.app');
  const registerHtml = `
  <form class="add-form">
  <input type="name" class="add-form-text add-form-input add-form-named" placeholder="Введите имя" />
  <input type="login" class="add-form-text add-form-input add-form-login" placeholder="Введите логин" rows="4"></input>
  <input type="password" class="add-form-text add-form-input add-form-password" placeholder="Введите пароль" rows="4"></input>
  <div class="add-form-authorization">
    <button class="add-form-button-enter">Зарегистрироваться</button>
    <a class="add-form-button-register">Войти</a>
  </div>
</form>
`;
  appElement.innerHTML = registerHtml;

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

export { renderRegister };
