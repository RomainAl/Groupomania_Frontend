<template>
  <v-container fluid>
    <v-row justify="center">
      <v-subheader>Today</v-subheader>

      <v-expansion-panels popout>
        <v-expansion-panel
          v-for="(subject, i) in subjects"
          :key="i"
          hide-actions
        >
          <v-expansion-panel-header>
            <v-row
              align="center"
              class="spacer"
              no-gutters
            >
              <v-col
                cols="4"
                sm="2"
                md="1"
              >
                <v-avatar
                  size="36px"
                >
                  <img
                    v-if="subject.imageUrl"
                    alt="Avatar"
                    src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
        >
                  <v-icon
                    v-else
                    mdi-message-image
                  ></v-icon>
                </v-avatar>
              </v-col>

              <v-col
                class="hidden-xs-only"
                sm="5"
                md="3"
              >
                <strong v-html="subject.user.username"></strong>
              </v-col>

              <v-col
                class="text-no-wrap"
                cols="5"
                sm="3"
              >
                <v-chip
                  v-if="subject.comment.length > 0"
                  color="primary"
                  class="ml-0 mr-2 black--text"
                  label
                  small
                >
                  {{ subject.comment.length }} comments
                </v-chip>
                <strong v-html="subject.title"></strong>
              </v-col>

              <v-col
                v-if="subject.description"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                &mdash;
                {{ subject.description }}
              </v-col>
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-text="subject.text"></v-card-text>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-card-text>
      <v-alert type="info">
        {{message}}
      </v-alert>
    </v-card-text>
  </v-container>
</template>

<script>
import SubjectDataService from "../services/SubjectDataService";

export default {
  name: "subjects-list",
  data() {
    return {
      subjects: [],
      title: "",
      message: ""
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {

    retrieveSubjects() {
      
      SubjectDataService.getAll()
        .then((response) => {
          this.message = "tamere";
          this.subjects = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          this.message = e.message;
        });
        
    },

    refreshList() {
      this.retrieveSubjects();
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
  },

  mounted() {
    this.retrieveSubjects();
  },
};
</script>

<style>
.list {
  max-width: 750px;
}
</style>
