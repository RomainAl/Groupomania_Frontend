<template>
<v-container fluid>
    <v-card
    width="600"
    class="mx-auto"
    v-if="currentSubject">
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-btn 
        small @click="showSubject(currentSubject.id)"
        icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h6 font-weight-regular">
          Edit {{currentSubject.title}}
        </v-card-title>
        <v-spacer></v-spacer>
        <v-btn 
        small @click="deleteSubject(currentSubject.id)"
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
            v-model="currentSubject.title"
            :rules="[(v) => !!v || 'Title is required']"
            label="Title"
            counter
            maxlength="20"
          ></v-text-field>

          <v-text-field
            v-model="currentSubject.description"
            :rules="[(v) => !!v || 'Description is required']"
            label="Description"
            counter
            maxlength="50"
          ></v-text-field>

          <v-textarea
            auto-grow
            clearable
            counter
            v-model="currentSubject.text"
            :rules="[(v) => !!v || 'Text is required']"
            label="Text"
          ></v-textarea>

          <label><strong>Status:</strong></label>
          {{ currentSubject.published ? "Published" : "Pending" }}

          <v-divider class="my-5"></v-divider>

          <v-btn color="secondary" small class="mr-2" @click="deleteSubject">
            Delete
          </v-btn>

          <v-btn 
          :disabled="!valid"
          color="primary" 
          small 
          @click="updateSubject">
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
    <v-card-text v-else>
      <p>Please click on a Subject...</p>
    </v-card-text>
  </v-container>
</template>

<script>
//-------------------------
// Composant/page "Edit d'un sujet" :
//-------------------------
// OPTIMISATION POSSIBLE (TODO):
// Créer un composant "formulaire" que les page "add" et "edit" lanceraient
//
// Charge les services axios pour accéder à l'API "subjects" du backend :
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "edit-subject",
  data() {
    return {
      valid: true,
      currentSubject: null,
      successful: false,
      message: "",
    };
  },
  methods: {

    // Charge les données actuels du suject (backend)
    getSubject(id) {
      SubjectDataService.get(id)
        .then((response) => {
          this.currentSubject = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // met à jour le sujet modifié (backend)
    updateSubject() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()){

        SubjectDataService.update(this.currentSubject.id, this.currentSubject)
          .then((response) => {
            console.log(response.data);
            this.message = "The subject was updated successfully!";
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

    // Efface le sujet
    deleteSubject() {
      SubjectDataService.delete(this.currentSubject.id)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ name: "subjects" });
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // Renvoie vers la page du sujet modifié
    showSubject(id) {
      this.$router.push({ name: "show-subject", params: { id: id } });
    },
  },

  // Charge le sujet du backend dès que possible
  mounted() {
    this.message = "";
    this.getSubject(this.$route.params.id);
  },
};
</script>

<style>
</style>
