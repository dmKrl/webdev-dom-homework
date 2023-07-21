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
// Функция даты, для добавления значения 0 перед числами < 10
const dateForComments = (date) => {
  let data = date.getDate();
  let month = date.getMonth();
  let hour = date.getHours();
  let minute = date.getMinutes();

  if (data < 10) {
    data = '0' + data;
  }
  if (month < 10) {
    month = '0' + (month + 1);
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  return `${data}.${month}.${date
    .getFullYear()
    .toString()
    .substr(-2)} ${hour}:${minute}`;
};

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
          date: dateForComments(new Date(comment.date)),
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
          date: dateForComments(new Date(comment.date)),
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