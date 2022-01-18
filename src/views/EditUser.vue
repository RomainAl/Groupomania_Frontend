<template>
<v-container fluid>
    <v-card
    width="600"
    class="mx-auto">
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-btn 
        small @click="showUser()"
        icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h6 font-weight-regular">
          Edit informations
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn 
        small @click="deleteUser"
        color="white"
        icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
        
      <v-card-text>

        <v-form 
        ref="form"
        v-model="valid"
        lazy-validation>
          <v-text-field
            v-model="user.username"
            :rules="[rules.required, rules.minname]"
            label="User name"
            counter
            maxlength="20"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="user.email"
            :rules="[rules.required, rules.email]"
            label="Email"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="user.firstname"
            :rules="[rules.required,rules.minname]"
            label="First name"
            counter
            clearable
            maxlength="20"
          ></v-text-field>

          <v-text-field
            v-model="user.lastname"
            :rules="[rules.required,rules.minname]"
            label="Last name"
            counter
            clearable
            maxlength="20"
          ></v-text-field>

          <v-text-field
            v-model="user.phonenumber"
            :rules="[rules.required,rules.phonenumber]"
            label="Phone number"
            counter
            clearable
          ></v-text-field>

          <v-divider class="my-5"></v-divider>

          <v-toolbar
            color="secondary"
            dark
            flat
          >
            <v-icon>mdi-security</v-icon>
            <v-card-title class="text-h6 font-weight-regular">
              Password
            </v-card-title>
          </v-toolbar>

          <v-text-field
            filled
            v-model="user.password"
            :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="showpassword ? 'text' : 'password'"
            name="Password"
            label="Password"
            hint="At least 8 characters"
            @click:append="showpassword = !showpassword"
            clearable
          ></v-text-field>
          
          <v-btn color="secondary" small class="mr-2" @click="deleteUser">
            Delete
          </v-btn>

          <v-btn 
          :disabled="!valid"
          color="primary" 
          small 
          @click="updateUserInfo">
            Update
          </v-btn>
        </v-form>

      </v-card-text>
      
      <v-card-text v-if="message">
        <v-alert type="error" v-if="!successful">
          {{message}}
        </v-alert>
        <v-alert type="success" v-else>
          {{message}}
        </v-alert>
      </v-card-text>

    </v-card>

  </v-container>
</template>

<script>
//-------------------------
// Composant/page "Edit d'un utilisateur" :
//-------------------------
// Charge les services axios pour accéder à l'API "users" du backend :
import UserDataService from "../services/UserDataService";

export default {
  name: "edit-user",
  data() {
    return {
      valid: true,
      user: {
        username: this.$store.state.auth.user.username,
        email: this.$store.state.auth.user.email,
        firstname: this.$store.state.auth.user.firstname, 
        lastname: this.$store.state.auth.user.lastname,
        phonenumber: this.$store.state.auth.user.phonenumber,
        password: ''},
        
      password: '',
      showpassword: false,
      successful: false,
      message: "",
      rules: {
          counter: value => value.length <= 20 || 'Max 20 characters',
          required: value => !!value || 'Required.',
          minname: v => v.length >= 2 || 'Min 2 characters',
          min: v => v.length >= 8 || 'Min 8 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
          phonenumber: value => {
            const pattern = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
            return pattern.test(value) || 'Phone number be 10 digits' 
          }
        }
    };
  },

  computed: {
    // Charge les données de l'utilisateur stocké dans le store (vuex)
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {

    // Renvoie vers la page profi
    showUser(){
      this.$router.push('/Profil');
    },

    // Après validation du formulaire
    // Met à jour les info utilisateur entré dans la base de donnée (backend)
    updateUserInfo() {
      
      this.$refs.form.validate();
      if (this.$refs.form.validate()){

        UserDataService.update(this.currentUser.id, this.user)
          .then(() => {

            this.$store.dispatch('auth/login', {username: this.user.username, password: this.user.password}).then(
                () => {
                  this.message = "The user was updated successfully!";
                  this.successful = true;
                },
                error => {
                  this.loading = false;
                  this.message =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                    this.successful = false;
                }
              );

          })
          .catch((e) => {
            console.log(e);
            this.message = e.message;
            this.successful = false;
          });

      } else {
        this.successful = false;
        this.message = "Incorrect inputs";
      }
    },

    // Efface l'utilisateur de la base de donnée (backend) et "logout"
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

    // Déconnecte/efface tout et renvoie vers la page login
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
      window.location.reload();
    }

  },
  
  mounted() {
    this.message = "";
  },
};
</script>

<style>
</style>
