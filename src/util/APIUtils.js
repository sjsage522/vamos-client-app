import {API_BASE_URL} from "../config/AppConfig";

export function request(api, method, dto) {
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    let options = {
        headers,
        credentials: 'include',
        url: API_BASE_URL + api,
        method,
    }

    if (dto) {
        options.body = JSON.stringify(dto);
    }

    return fetch(options.url, options)
        .then((response) => {
            if (!response.ok) return Promise.reject(response)
            return response;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

export function login(loginRequest) {
    return request("/auth/login", "POST", loginRequest)
        .then(() => {
            window.location.href = "/"
        });
}

export function logout() {
    request("/auth/logout", "POST", null)
        .then(() => {
            window.location.href = "/login"
        });
}

export function signup(signupRequest) {
    return request("/auth/signup", "POST", signupRequest);
}

export function uploadBoard(item) {

    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('content', item.content);
    formData.append('price', item.price);
    formData.append('categoryNumber', item.categoryNumber);
    for (let i=0; i<item.files.length; i++) {
        formData.append("files", item.files[i]);
    }

    return fetch(API_BASE_URL + "/board", {
        credentials: 'include',
        method: "POST",
        body: formData,
    })
}

export function updateBoard(item, id) {
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('content', item.content);
    formData.append('price', item.price);
    formData.append('categoryNumber', item.categoryNumber);
    for (let i=0; i<item.files.length; i++) {
        formData.append("files", item.files[i]);
    }

    return fetch(API_BASE_URL + "/board/" + id, {
        credentials: 'include',
        method: "PATCH",
        body: formData,
    })
}