//-------------------------
// Service permettant les communication des sécurité
// entre le frontend (stocké localStorage)
// et le backend (API)
//-------------------------
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

// Class aux méthodes permettant le login/logout/enregistrement
// écrivant/lisant directement sur la base de donnée (backend)
class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
