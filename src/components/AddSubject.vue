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
          small @click="newSubject()"
          color="white"
          icon>
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-card-title class="text-h6 font-weight-regular">
          Create a new post
        </v-card-title>
        <v-spacer></v-spacer>
      <v-btn 
        small
        v-if = "newSubjectId"
        @click="showSubject(newSubjectId)"
        color="white"
        icon>
          <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      </v-toolbar>

      <v-card-text>

        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation>
          <v-text-field
            v-model="subject.title"
            :rules="[(v) => !!v || 'Title is required']"
            label="Title"
            counter
            maxlength="20"
          ></v-text-field>

          <v-text-field
            v-model="subject.description"
            :rules="[(v) => !!v || 'Description is required']"
            label="Description"
            counter
            maxlength="50"
          ></v-text-field>

          <v-textarea
            auto-grow
            clearable
            counter
            v-model="subject.text"
            :rules="[(v) => !!v || 'Text is required']"
            label="Text"
          ></v-textarea>

          <v-divider class="my-5"></v-divider>

          <v-btn 
          :disabled="!valid"
          color="primary" 
          small 
          @click="saveSubject">
            Create
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
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "add-subject",
  data() {
    return {
      subject: {
        title: "",
        description: "",
        text: ""
      },
      successful: false,
      valid: true,
      message: '',
      newSubjectId: 0
    };
  },
  methods: {
    saveSubject() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()){
          var data = {
            title: this.subject.title,
            description: this.subject.description,
            text: this.subject.text,
          };

          SubjectDataService.create(data)
            .then((response) => {
              console.log(response.data);
              this.message = "The subject was updated successfully!";
              this.newSubjectId = response.data.id;
              this.successful = true;
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

    newSubject() {
      this.subject = {};
      this.message ='';
      this.$refs.form.resetValidation();
    },

    showSubject(id) {
      this.$router.push({ name: "show-subject", params: { id: id } });
    },
  },
};
</script>

<style>
</style>
