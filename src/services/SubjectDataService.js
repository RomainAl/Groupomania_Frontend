import axios from 'axios';
import authHeader from './auth-header';
const http = axios.create({
  baseURL: "http://localhost:8080/api/subject",
  headers: authHeader()
});

class SubjectDataService {
  getAll() {
    return http.get("/");
  }

  get(id) {
    return http.get(`/${id}`);
  }

  // WORKING PROGRESS
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

export default new SubjectDataService();