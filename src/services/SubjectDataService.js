//-------------------------
// Création de la class "service" des users
// permettant la communication (axios) entre le 
// frontend et le backend
//-------------------------
import axios from 'axios'; // Importe la library "axios"
import authHeader from './auth-header'; // Importe les données utilisateurs du store (token)
const http = axios.create({
  baseURL: "http://localhost:8080/api/subject",
  headers: authHeader()
});

// Création de la class aux méthodes accédantes à l'API :
class SubjectDataService {
  getAll() {
    return http.get("/");
  }

  get(id) {
    return http.get(`/${id}`);
  }

  createWithImage(file, data, onUploadProgress) {
      let formData = new FormData();
      let user = JSON.parse(localStorage.getItem('user'));

      formData.append("file", file);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("text", data.text);

      return http.post("/", formData, {
        headers: {
          'x-access-token': user.accessToken, 
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress
      });
  }

  updateWithImage(id, file, data, onUploadProgress) {
    let formData = new FormData();
    let user = JSON.parse(localStorage.getItem('user'));

    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("text", data.text);

    return http.put(`/${id}`, formData, {
      headers: {
        'x-access-token': user.accessToken, 
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
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

  findByTitle(title) {
    return http.get(`?title=${title}`);
  }
}

// Exporte la class pour la rendre accessible aux pages/composant du site
export default new SubjectDataService();