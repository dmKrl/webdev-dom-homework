import format from "date-fns/format";
const todosUrl = `https://wedev-api.sky.pro/api/v2/kralichkin-dmitry/comments`;
const userUrl = `https://wedev-api.sky.pro/api/user/login`;

let token;
let name;

const setToken = (newToken) => {
  token = newToken;
};

const setLoginName = (newName) => {
  return name = newName;
}

// Функция получения данных без авторизации
function getTodo() {
  return fetch(todosUrl, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      return responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: format(new Date(comment.date), 'dd.MM.yy hh:mm'),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: false,
          id: comment.id,
        };
      });
    });
}

// Функция получения данных с авторизацией
function getTodoWithAuthorization() {
  return fetch(todosUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      return responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: format(new Date(comment.date), 'dd.MM.yy hh:mm'),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: false,
          id: comment.id,
        };
      });
    });
}
//   Функция отправки данных на сервер
function postTodo(userName, userComment) {
  // Отправляем запрос за публикацию карточки в массив
  const fetchPromise = fetch(todosUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: userComment,
      name: userName,
      isLikeLoading: false,
      forceError: true,
    }),
  });
  return fetchPromise;
}

//   Функция отправки данных на сервер
function login({ login, password }) {
  // Отправляем запрос за публикацию карточки в массив
   return fetch(userUrl, {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    return response.json();
  });
}
export { getTodo, postTodo, login, setToken, token, getTodoWithAuthorization, setLoginName, name };
