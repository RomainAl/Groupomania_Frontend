<template>
  <v-row align="center" class="list px-3 mx-auto">
    <v-col cols="12" md="8">
      <v-text-field v-model="title" label="Search by Title"></v-text-field>
    </v-col>

    <v-col cols="12" md="4">
      <v-btn small @click="searchTitle">
        Search
      </v-btn>
    </v-col>

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Subjects</v-card-title>

        <v-data-table
          :headers="headers"
          :items="subjects"
          enable-pagination
          :hide-default-footer="false"
          @click:row="handleClick"
        >
          <template v-slot:[`item.title`]= "{ item }">
            <v-btn text @click="showSubject(item.id)">{{item.title}}</v-btn>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="showSubject(item.id)">mdi-eye</v-icon>
            <v-icon v-if= "item.user===currentUser.username" small class="mr-2" @click="editSubject(item.id)">mdi-pencil</v-icon>
            <v-icon v-if= "item.user===currentUser.username" small @click="deleteSubject(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-card-actions v-if="subjects.length > 0">
          <v-btn small color="error" @click="removeAllSubjects">
            Remove All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";
export default {
  name: "subjects-list",
  data() {
    return {
      subjects: [],
      title: "",
      headers: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {

    handleClick(value) {
      this.highlightClickedRow(value);
    },

    retrieveSubjects() {
      SubjectDataService.getAll()
        .then((response) => {
          this.subjects = response.data.map(this.getDisplaySubject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveSubjects();
    },

    headersScreenDependance(){
      if (this.$vuetify.breakpoint.width > 400) {
        this.headers = [
                        { text: "Title", align: "start", sortable: false, value: "title" },
                        { text: "Description", value: "description", sortable: false },
                        { text: "User", value: "user", sortable: false},
                        { text: "Comments", value: "comments", sortable: false },
                        { text: "Actions", value: "actions", sortable: false },
                      ]

      } else {
          this.headers = [
                        { text: "Title", align: "start", sortable: false, value: "title" },
                        { text: "Comments", value: "comments", sortable: false }
                      ]
      }
    },
    
    removeAllSubjects() {
      SubjectDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchTitle() {
      SubjectDataService.findByTitle(this.title)
        .then((response) => {
          this.subjects = response.data.map(this.getDisplaySubject);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    editSubject(id) {
      this.$router.push({ name: "edit-subject", params: { id: id } });
    },

    showSubject(id) {
      this.$router.push({ name: "show-subject", params: { id: id } });
    },

    deleteSubject(id) {
      SubjectDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplaySubject(subject) {
      return {
        id: subject.id,
        title: subject.title.length > 30 ? subject.title.substr(0, 30) + "..." : subject.title,
        description: subject.description.length > 30 ? subject.description.substr(0, 30) + "..." : subject.description,
        comments: subject.comment.length,
        user: subject.user.username,
      };
    },
  },

  mounted() {
    this.retrieveSubjects();
    this.headersScreenDependance();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
