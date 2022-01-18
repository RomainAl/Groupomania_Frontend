<template>
 <v-container class="show-form">
    <v-row justify="space-around">
      <v-card width="700">
        <v-img
          src="https://cdn.vuetifyjs.com/images/lists/ali.png"
          height="300px"
        >
          <v-app-bar
            flat
            color="rgba(0, 0, 0, 0)"
          >

            <v-toolbar-title class="text-h6 white--text pl-0">
              {{currentUser.username}}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
              color="white"
              small 
              @click="editUser"
              icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="white"
              small 
              @click="deleteUser"
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-app-bar>

        </v-img>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-account-outline
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{currentUser.lastname}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>{{currentUser.firstname}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-phone
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>+33 (0) {{currentUser.phonenumber}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-email
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{currentUser.email}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-server-security
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Authority : {{currentUser.role}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import UserDataService from "../services/UserDataService";

export default {
  name: 'Profil',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },

  methods: {
    editUser() {
      this.$router.push({ name: "edit-user", params: { id: this.currentUser.id } });
    },

    deleteUser() {

      UserDataService.delete(this.currentUser.id)
        .then((response) => {
          console.log(response.data);
          this.logOut();
        })
        .catch((e) => {
          console.log(e);
          this.message = e.message;
        });
        
    },

    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
      window.location.reload();
    }

  }
};
</script>