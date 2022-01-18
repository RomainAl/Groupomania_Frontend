//-------------------------
// Création de la class "service" des users
// permettant la communication (axios) entre le 
// frontend et le backend
//-------------------------
import axios from 'axios'; // Importe la library "axios"
import authHeader from './auth-header'; // Importe les données utilisateurs du store (token)
const http = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: authHeader()
});

// Création de la class aux méthodes accédantes à l'API :
class UserDataService {

  getAll() {
    return http.get("/");
  }

  get(id) {
    return http.get(`/${id}`);
  }

  update(id, data) {
    return http.put(`/${id}`, data);
  }

  delete(id) {
    return http.delete(`/${id}`);
  }

  findByUsername(username) {
    return http.get(`?username=${username}`);
  }

}

// Exporte la class pour la rendre accessible aux pages/composant du site
export default new UserDataService();