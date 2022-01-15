<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center mr-2">
        GROUPOMANIA
      </div>

      <v-btn  v-if="currentUser" to="/profile" text>
        {{ currentUser.username }}
      </v-btn>

      <v-btn  v-if="currentUser" to="/subjects" text>
        Forum
      </v-btn>

      <v-btn v-if="currentUser" to="/add"  text>
        Add
      </v-btn>

      <v-btn v-if="!currentUser" to="/register"  text>
        Sign Up
      </v-btn>

      <v-btn to="/login"  text>
        Login
      </v-btn>

      <v-btn @click.prevent="logOut" text>
        LogOut
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
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
