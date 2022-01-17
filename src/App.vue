<template>
  <v-app>
    <v-app-bar app dark>
      <v-app-bar-nav-icon 
        v-if="!$vuetify.breakpoint.mdAndUp"
        @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
          <v-layout align-center justify-center>
              <v-flex xs8 sm4 md3 lg2>
                <v-img
                  src="./assets/groupomania-logo.png" 
                  alt="groupomania-logo"
                  contain
                >
                </v-img>
              </v-flex>
          </v-layout>
    </v-app-bar>

    <v-navigation-drawer 
      :permanent="$vuetify.breakpoint.mdAndUp"
      v-model="drawer" 
      light
      app
      height="100%"
    >
      <v-list-item>
        <v-list-item-title>
            <v-img
              src="./assets/groupomania-icon.png" 
              alt="groupomania-icon"
              contain
              height="200px"
              class="mr-30"
            >
            </v-img>
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
      
        <v-list-item
          link
          v-if="currentUser" 
          to="/profil" 
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title >{{ currentUser.username }}</v-list-item-title>
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
            <v-list-item-title>Create a new post</v-list-item-title>
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

        <v-divider></v-divider>

        <v-list-item
          v-if="currentUser&&(currentUser.role === 'admin')"
          link
          to="/users"
        >
          <v-list-item-icon>
            <v-icon>mdi-account-search</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>User list</v-list-item-title>
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
      window.location.reload();
    }
  }
};
</script>
