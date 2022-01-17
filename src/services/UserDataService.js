import axios from 'axios';
import authHeader from './auth-header';
const http = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: authHeader()
});

class SubjectDataService {
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

export default new SubjectDataService();