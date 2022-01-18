<template>
  <v-container fluid>
      <v-card 
        width="600"
        class="mx-auto">
        
        <v-toolbar dark color="primary">
          <v-toolbar-title>Sign up</v-toolbar-title>
        </v-toolbar>
        
        <v-card-text>
          <v-form 
          ref="form"
          v-model="valid"
          lazy-validation>

            <v-text-field
              v-model="user.username"
              :rules="[rules.required, rules.counter, rules.minname]"
              label="Username"
              counter
              maxlength="10"
            ></v-text-field>
            
            <v-text-field
              v-model="user.email"
              :rules="[rules.required, rules.email]"
              label="Email"
            ></v-text-field>

            <v-text-field
              v-model="user.password"
              :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showpassword ? 'text' : 'password'"
              name="Password"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="showpassword = !showpassword"
            ></v-text-field>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                :disabled="!valid"
                color="primary"
                class="mr-4"
                @click="handleRegister">
                  Sign Up
                  </v-btn>
            </v-card-actions>
            
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
// Composant/page de l'enregistrement :
//--------------------------
import User from '../models/user';

export default {
  name: 'Register',
  data() {
    return {
      valid: true,
      user: new User('', '', ''),
      successful: false,
      message: '',
      showpassword: false,
      rules: {
          counter: value => value.length <= 20 || 'Max 20 characters',
          required: value => !!value || 'Required.',
          minname: v => v.length >= 2 || 'Min 2 characters',
          min: v => v.length >= 8 || 'Min 8 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        }
    };
  },
  
  computed: {
    // du store vuex on vérifie si on est pas déjà logué
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  // Si oui l'utilisateur est renvoyé vers son profil au lieu de venir ici
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profil');
    }
    this.message = "";
  },
  
  methods: {
    // Validation du formulaire puis on dispatch l'action (store vuex) de login
    // Si validation, l'utilisateur est renvoyé vers son profil
    handleRegister() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()){
        this.$store.dispatch('auth/register', this.user).then(
          data => {
            this.message = data.message;
            this.successful = true;
          },
          error => {
            this.message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
            this.successful = false;
          }
        );
        
      } else {

          this.message = "Incorrect inputs";

      }

    }
  }
};
</script>

<style> </style>