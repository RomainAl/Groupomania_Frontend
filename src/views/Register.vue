<template>
  <v-app id="inspire">
    <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
              <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
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
                          clearable
                        ></v-text-field>
                        
                        <v-text-field
                          v-model="user.email"
                          :rules="[rules.required, rules.email]"
                          label="Email"
                          clearable
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
                          clearable
                        ></v-text-field>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn 
                            :disabled="!valid"
                            color="success"
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
              </v-flex>
          </v-layout>
        </v-container>
    </v-content>
  </v-app>
</template>

<script>
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
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  
  methods: {

    handleRegister() {
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