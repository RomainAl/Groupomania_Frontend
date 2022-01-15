import axios from 'axios';
import authHeader from './auth-header';
const http = axios.create({
  baseURL: "http://localhost:8080/api/comment",
  headers: authHeader()
});

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

  findByTitle(title) {
    return http.get(`?title=${title}`);
  }
}

export default new CommentDataService();