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
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: "/subjects",
      alias: "/subjects",
      name: "subjects",
      component: () => import("./components/SubjectsList")
    },
    {
      path: "/editsubjects/:id",
      name: "edit-subject",
      component: () => import("./components/EditSubject")
    },
    {
      path: "/add",
      name: "add",
      component: () => import("./components/AddSubject")
    },
    {
      path: "/subjects/:id",
      name: "show-subject",
      component: () => import("./components/ShowSubject")
    }
  ]
});

// Check Authorized status everytime a navigating action is trigger :
// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });
