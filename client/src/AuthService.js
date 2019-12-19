/**
 * Service class for authenticating users against an API
 * and storing JSON Web Tokens in the browser's LocalStorage.
 */
var jwtDecode = require('jwt-decode');
class AuthService {
    constructor(auth_api_url) {
        this.auth_api_url = auth_api_url;
    }

    async login(username, password) {
        const res = await this.fetch(this.auth_api_url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });
        let json = await res.json();
        if (res.status === 401) {
            throw Error(json.msg);
        }
        this.setToken(json.token);
        this.setIsAdmin(json.admin);
        this.setUsername(username);
        return json;
    }

    loggedIn() {
        if (!this.getToken()) {
            return false;
        }
        
        if (jwtDecode(this.getToken()).exp < Date.now() / 1000) {
            this.logout();
            return false;
        }
        return true;
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    setUsername(username) {
        localStorage.setItem("username", username);
    }

    setIsAdmin(isAdmin) {
        localStorage.setItem("admin", isAdmin);
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    getIsAdmin() {
        return (localStorage.getItem("admin") === 'true');
    }

    getToken() {
        return localStorage.getItem("token");
    }

    logout() {
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    }

    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        });
    }
}

export default AuthService;
