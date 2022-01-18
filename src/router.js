//----------------------------------
// Création du router (vue-router) permettant de donner
// des chemins d'accès (url) à nos views/composants
//----------------------------------
import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('./views/Profil.vue')
    },
    {
      path: "/subjects",
      alias: "/subjects",
      name: "subjects",
      component: () => import("./views/SubjectsList")
    },
    {
      path: "/users",
      alias: "/users",
      name: "users",
      component: () => import("./views/UsersList")
    },
    {
      path: "/editsubjects/:id",
      name: "edit-subject",
      component: () => import("./views/EditSubject")
    },
    {
      path: "/editusers/:id",
      name: "edit-user",
      component: () => import("./views/EditUser")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./views/AddSubject")
    },
    {
      path: "/subjects/:id",
      name: "show-subject",
      component: () => import("./views/ShowSubject")
    }
  ]
});
