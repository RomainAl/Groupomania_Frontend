<template>
  <div v-if="currentSubject" class="edit-form py-3">
    <p class="headline">Edit Subject</p>

    <v-form ref="form" lazy-validation>
      <v-text-field
        v-model="currentSubject.title"
        :rules="[(v) => !!v || 'Title is required']"
        label="Title"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentSubject.description"
        :rules="[(v) => !!v || 'Description is required']"
        label="Description"
        required
      ></v-text-field>

      <v-text-field
        v-model="currentSubject.text"
        :rules="[(v) => !!v || 'Text is required']"
        label="Text"
        required
      ></v-text-field>

      <label><strong>Status:</strong></label>
      {{ currentSubject.published ? "Published" : "Pending" }}

      <v-divider class="my-5"></v-divider>

      <v-btn v-if="currentSubject.published"
        @click="updatePublished(false)"
        color="primary" small class="mr-2"
      >
        UnPublish
      </v-btn>

      <v-btn v-else
        @click="updatePublished(true)"
        color="primary" small class="mr-2"
      >
        Publish
      </v-btn>

      <v-btn color="error" small class="mr-2" @click="deleteSubject">
        Delete
      </v-btn>

      <v-btn color="success" small @click="updateSubject">
        Update
      </v-btn>
    </v-form>

    <p class="mt-3">{{ message }}</p>
  </div>

  <div v-else>
    <p>Please click on a Subject...</p>
  </div>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "edit-subject",
  data() {
    return {
      currentSubject: null,
      message: "",
    };
  },
  methods: {
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

    updatePublished(status) {
      var data = {
        id: this.currentSubject.id,
        title: this.currentSubject.title,
        description: this.currentSubject.description,
        published: status,
      };

      SubjectDataService.update(this.currentSubject.id, data)
        .then((response) => {
          this.currentSubject.published = status;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    updateSubject() {
      SubjectDataService.update(this.currentSubject.id, this.currentSubject)
        .then((response) => {
          console.log(response.data);
          this.message = "The subject was updated successfully!";
        })
        .catch((e) => {
          console.log(e);
        });
    },

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
  },
  mounted() {
    this.message = "";
    this.getSubject(this.$route.params.id);
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>
