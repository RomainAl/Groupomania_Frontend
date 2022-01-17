<template>
  <v-container fluid>
      <v-card 
        width="600"
        class="mx-auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
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
                maxlength="20"
              ></v-text-field>

              <v-text-field
                v-model="user.password"
                :append-icon="showpassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showpassword ? 'text' : 'password'"
                name="Password"
                label="Password"
                hint="At least 8 characters"
                @click:append="showpassword = !showpassword"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :disabled="!valid" @click="handleLogin" color="primary" to="/">Login</v-btn>
              </v-card-actions>
              
            </v-form>
        </v-card-text>
      
        <v-alert  type="error" v-if="message">
          {{message}}
        </v-alert>
          
      </v-card>
  </v-container>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      user: new User('', ''),
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
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profil');
    }
  },
 
  methods: {

    handleLogin() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()){

            if (this.user.username && this.user.password) {
              this.$store.dispatch('auth/login', this.user).then(
                () => {
                  this.$router.push('/profil');
                },
                error => {
                  this.message =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                }
              );
            }

      } else {

          this.message = "Incorrect inputs";

      }
    }
  }
};
</script>

<style> </style>