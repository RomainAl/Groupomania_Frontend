<template>
  <v-app>
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="d-flex align-center mr-2">GROUPOMANIA</v-toolbar-title>  
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      light
      app
      height="100%"
    >

      <v-list
        dense
        nav
      >
      
        <v-list-item
          link
          v-if="currentUser" 
          to="/profile" 
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ currentUser.username }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>


        <v-list-item
          link
          v-if="currentUser" 
          to="/subjects" 
        >
          <v-list-item-icon>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Forum</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>

        <v-list-item
          link
          v-if="currentUser" 
          to="/add" 
        >
          <v-list-item-icon>
            <v-icon>mdi-comment-plus-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Add post</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
            v-if="!currentUser" 
          link
          to="/register"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sign up</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>

        <v-list-item
          v-if="!currentUser" 
          link
          to="/login"
        >
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>

        <v-list-item
          v-if="currentUser" 
          link
          @click.prevent="logOut"
        >
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
          
        </v-list-item>


      </v-list>
    </v-navigation-drawer>

    

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      valid: true,
      items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>
