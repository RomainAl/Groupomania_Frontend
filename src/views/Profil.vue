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
              {{user.username}}
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
              <v-list-item-title>{{user.lastname}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>{{user.firstname}}</v-list-item-title>
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
              <v-list-item-title>+33 (0) {{user.phonenumber.substring(1,10)}}</v-list-item-title>
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
              <v-list-item-title>{{user.email}}</v-list-item-title>
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
//-------------------------
// Composant/page du profil utilisateur :
//--------------------------
// Charge les services axios pour accéder à l'API "users" du backend :
import UserDataService from "../services/UserDataService";
import User from '../models/user';

export default {
  name: 'Profil',
  data() {
    return {
      valid: true,
      user: new User('', '', '', '', '', '', ''),
    };
  },

  computed: {
    // Charge les données de l'utilisateur stocké dans le store (vuex)
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  // Si l'utilisateur n'existe pas (pas de token), on renvoie vers la page login
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.refreshUser(this.currentUser.id);
    this.message = "";
  },

  methods: {
    refreshUser(id) {
      this.getUser(id);
    },

    // Charge les données personnelles de l'utilisateur du backend
    getUser(id) {
      UserDataService.get(id)
        .then((response) => {
          this.user = response.data;
          console.log(response.data);
          this.successful = true;
        })
        .catch((e) => {
          console.log(e);
          this.message = e.message;
          this.successful = false;
        });
    },

    // Renvoie vers la page "edit" de l'utilisateur
    editUser() {
      this.$router.push({ name: "edit-user", params: { id: this.currentUser.id } });
    },

    // Efface l'utilisateur puis logout
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

    // Dispatch l'action générale "logout" du store et retour à la page "login"
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
      window.location.reload();
    }

  }
};
</script>