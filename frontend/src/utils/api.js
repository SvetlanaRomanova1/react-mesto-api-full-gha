class Api {
    constructor(options) {
        this.baseUrl = options.baseUrl;
        this.headers = options.headers;
        this.deleteCard = this.deleteCard.bind(this);
    }

    // Приватный метод для проверки ответа от сервера и обработки ошибок
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    // Метод для получения информации о пользователе с сервера
    getUserInfo() {
        return fetch(`${this.baseUrl}/users/me`, {
            headers: this.headers,
        }).then(this._checkResponse);
    }

    // Метод для получения списка карточек с сервера
    getCards() {
        return fetch(`${this.baseUrl}/cards`, {
            headers: this.headers,
        }).then(this._checkResponse);
    }

    // Метод для редактирования информации о пользователе на сервере
    editUserInfo(user) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
            },
            body: JSON.stringify({
                name: user.name,
                about: user.about,
            }),
        }).then(this._checkResponse);
    }

    // Метод для добавления новой карточки на сервер
    addNewCard(data) {
        return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: {
                ...this.headers,
            },
            body: JSON.stringify(data),
        }).then(this._checkResponse);
    }

    // Метод для удаления карточки на сервере
    deleteCard(id) {
        return fetch(`${this.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.headers,
        }).then(this._checkResponse);
    }

    // Метод для установки like
    likeCardAdd(id) {
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: this.headers,
        }).then(this._checkResponse);
    }

    // Метод для удаления like
    likeCardRemove(id) {
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this.headers,
        }).then(this._checkResponse);
    }

    //Метод для смены аватара
    changeAvatar(avatar) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                ...this.headers,
            },
            body: JSON.stringify({
                avatar,
            }),
        }).then(this._checkResponse);
    }

    signin(body){
        return fetch(`${this.baseUrl}/signin`,{
            method: 'POST',
            headers: {
                ...this.headers,
            },
            body: JSON.stringify(body)
        }).then(this._checkResponse);
    }

    signup(body) {
        return fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                ...this.headers,
            },
            body: JSON.stringify(body)
        }).then(this._checkResponse);
    }
    userInfo(jwt){
        return fetch(`${this.baseUrl}/users/me`,{
            method: 'GET',
            headers: {
                ...this.headers,
                "Authorization" : `Bearer ${jwt}`
            }
        }).then(this._checkResponse);
    }
}

// // Создание экземпляра api
// const api = new Api({
//     baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-72',
//     headers: {
//         authorization: 'feda086f-6f7a-4a92-a7c8-dfe4532414fe',
//         'Content-Type': 'application/json',
//     },
// });
//
// export const api2 = new Api({
//     baseUrl: 'https://auth.nomoreparties.co.',
//     headers: {
//         'Content-Type': 'application/json'
//     },
// })

const api = new Api({
    baseUrl: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
