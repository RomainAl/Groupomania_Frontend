<template>
  <div class="submit-form mt-3 mx-auto">
    <p class="headline">Add Subject</p>

    <div v-if="!submitted">
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="subject.title"
          :rules="[(v) => !!v || 'Title is required']"
          label="Title"
          required
        ></v-text-field>

        <v-text-field
          v-model="subject.description"
          :rules="[(v) => !!v || 'Description is required']"
          label="Description"
          required
        ></v-text-field>
        
        <v-text-field
          v-model="subject.text"
          :rules="[(v) => !!v || 'Text is required']"
          label="Text"
          required
        ></v-text-field>
      </v-form>

      <v-btn color="primary" class="mt-3" @click="saveSubject">Submit</v-btn>
    </div>

    <div v-else>
      <v-card class="mx-auto">
        <v-card-title>
          Submitted successfully!
        </v-card-title>

        <v-card-subtitle>
          Click the button to add new Subject.
        </v-card-subtitle>

        <v-card-actions>
          <v-btn color="success" @click="newSubject">Add</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "add-subject",
  data() {
    return {
      subject: {
        id: null,
        title: "",
        description: "",
        text: "",
        published: false,
      },
      submitted: false,
    };
  },
  methods: {
    saveSubject() {
      var data = {
        title: this.subject.title,
        description: this.subject.description,
        text: this.subject.text,
      };

      SubjectDataService.create(data)
        .then((response) => {
          this.subject.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    newSubject() {
      this.submitted = false;
      this.subject = {};
    },
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>
