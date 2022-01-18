//-------------------------
// Création de la class "service" des sujets
// permettant la communication (axios) entre le 
// frontend et le backend
//-------------------------
import axios from 'axios'; // Importe la library "axios"
import authHeader from './auth-header'; // Importe les données utilisateurs du store (token)
const http = axios.create({
  baseURL: "http://localhost:8080/api/comment",
  headers: authHeader()
});

// Création de la class aux méthodes accédantes à l'API :
class CommentDataService {
  getAll() {
    return http.get("/");
  }

  get(id) {
    return http.get(`/${id}`);
  }

  create(data) {
    return http.post("/", data);
  }

  update(id, data) {
    return http.put(`/${id}`, data);
  }

  delete(id) {
    return http.delete(`/${id}`);
  }

  deleteAll() {
    return http.delete(`/`);
  }
}

// Exporte la class pour la rendre accessible aux pages/composant du site
export default new CommentDataService();